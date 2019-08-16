/*eslint no-undef: "error"*/
/*eslint-env node*/
/*eslint no-prototype-builtins: "error"*/

const dbconnection = require('./connection');

module.exports = class {
    //Retrieve all the organization names from database
    all(callback) {
        dbconnection.query('SELECT org_name FROM organizations ORDER BY org_name ASC', (error, rows) => {
            if(error) {
                console.log('Error in query', error);
            } else {
                callback(rows);
            }
        });
    }

   //Look for an organization name, fetch its ID and then find its sibling and children
    async search(name, page = 0, callback) {
        const perPage = 100;
        let offset = page * perPage;
        let selectPromise = new Promise(resolve => {
            dbconnection.query('SELECT * FROM organizations WHERE org_name = ? LIMIT 1', [name], (error, rows) => {
                if(error) {
                    console.log('Error in query', error);
                } else {
                    if(rows.length) {
                        resolve(rows[0].org_id);
                    }
                    else {
                        resolve(false);
                    }
                }
            });
        });
    
        let id = await selectPromise.then(result => result);

        if(id) {
            
            let queryPromise = new Promise((resolve) => {
                let query = `SET @id = ?;
                    SELECT o.org_name,
                    CASE
                        WHEN r.child_id = @id THEN "parent"
                        WHEN r.parent_id = @id THEN "daughter"
                        ELSE "sibling"
                    END AS relation_type
                    FROM organizations AS o
                    JOIN relations AS r on 
                        (r.parent_id = o.org_id AND r.child_id = @id) OR 
                        (r.child_id = o.org_id AND r.parent_id = @id) OR
                        (r.child_id = o.org_id AND r.parent_id IN (
                            SELECT parent_id FROM relations WHERE child_id = @id
                        ))
                    WHERE o.org_id IS NOT NULL AND o.org_id != @id
                    GROUP BY o.org_id
                    ORDER BY o.org_name ASC
                    LIMIT ?, ?`;
                dbconnection.query(query, [id, offset, perPage], (error, rows) => {
                    if(error) {
                        console.log('Error in query', error);
                    } else {
                        resolve(rows[1]);
                    }
                });
            });
        
            let data = await queryPromise.then(result => result);
           
            callback(data);
        }
        else {
            callback(false);
        }
    }

    //If an organization does not exist, then add a new organization
    async create (org, parentId) {
        var selectQuery = "SELECT * FROM organizations WHERE org_name = ?"
        var insertQuery = "INSERT INTO organizations (org_name) VALUES(?)";
        var insertRelationQuery = "INSERT INTO relations (parent_id, child_id) VALUES(?,?)";
        var selectRelationQuery = "SELECT * FROM relations WHERE parent_id = ? AND child_id = ?";
        let selectPromise = new Promise((resolve) =>{
            dbconnection.query(selectQuery,[org.org_name], (error, rows) => {
                if(error) {
                    console.log('Error in query', error);
                } else {
                    if(rows.length) {
                        resolve( rows[0].org_id);
                    }
                    else {
                        resolve(false);
                    }
                }
            });
        });
    
        let id = await selectPromise.then(async result => {
    
            if(!result) {
    
                let insertPromise = new Promise((resolve) => {
                        dbconnection.query(insertQuery,[org.org_name], (error, results) => {
                        if(error) {
                            console.log('Error in query', error);
                        } else {
                            resolve(results.insertId);
                        }
                    });
                });
                
                return await insertPromise.then(result => {
                    return result;
                });
            }
            return result;
        });
        
        if(org.hasOwnProperty('daughters') && org.daughters.length) {
            for (let i in org.daughters) {
                await this.create(org.daughters[i], id);
            }
        }
    
        if(parentId) {
            dbconnection.query(selectRelationQuery, [parentId, id], (error, rows) => {
                if(error) {
                    console.log('Error in query', error);
                } else if(!rows.length) {
                    dbconnection.query(insertRelationQuery, [parentId, id], (error) => {
                        if(error) {
                            console.log('Error in query', error);
                        }
                    });
                }
            });  
        } 
    }
}