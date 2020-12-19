let db, config

// module.exports : classe
module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Members
}



let Members = class {

    // RECUPERER UN MEMBRE
    static getByID(id) {
        return new Promise((next) => {
           
            db.query('SELECT * FROM members WHERE id = ?', [id])
            .then((result) => {
                
                if (result[0] != undefined)
                    next(result[0])

                else 
                    next(new Error(config.errors.wrongID))
            })
            .catch((err) => next(err))
        })
    }

    // RECUPERER TOUS LES MEMBRES
    static getAll(max) {
        return new Promise((next) => {

            if (max != undefined && max > 0) {

                db.query('SELECT * FROM members LIMIT 0, ?', [parseInt(max)])
                    .then((result) => next(result))
                    .catch((err) => next(err))
            } 

            else if (max != undefined) {
                next(new Error(config.errors.wrongMaxValue))
            }

            else {

                db.query('SELECT * FROM members')
                    .then((result) => next(result))
                    .catch((err) => next(err))
            }

        })
    }


    // AJOUTER UN MEMBRE 
    static add(name) {
        return new Promise((next) => {

            if (name != undefined && name.trim() != '') {
                    
                    name = name.trim()

                    db.query('SELECT * FROM members WHERE name = ?', [name])
                        
                        .then((result) => {

                            // Si le membre sélectionné a un nom c'est qu'il est identique
                            if (result[0] != undefined) {
                                next(new Error(config.errors.nameAlreadyTaken))
                            }

                            else {
                                // Si nom pas pris on ajoute la personne
                                return db.query('INSERT INTO members(name) VALUES(?)', [name])
                            }
                        })

                        .then(() => {
                            // Afficher le nouvel ajout
                            return db.query('SELECT * FROM members WHERE name = ?', [name])
                        })
            
                        .then((result) => {
                            next({
                                id: result[0].id,
                                name: result[0].name
                            })
                        })
                        
                        .catch((err) => next(err))
            }

            else {
                next(new Error(config.errors.noNameValue))
            }
        })
    }



    // MODIFIER UN MEMBRE 
    static update(id, name) {
        return new Promise((next) => {

            if (name != undefined && name.trim() != '') {
                name = name.trim()

                db.query('SELECT * FROM members WHERE id = ?', [id])
                
                .then((result) => {

                    if (result[0] != undefined) {
                       return db.query('SELECT * FROM members WHERE name = ? and id = ?', [name, id])
                    }

                    else {
                        next(new Error(config.errors.wrongID))
                    }
                })

                .then((result) => {

                    if (result[0] != undefined) {
                        next(new Error(config.errors.sameName))
                    }

                    else {
                        return db.query('UPDATE members SET name = ? WHERE id = ?', [name, id])
                    }
                })

                .then(() => next(true))

                .catch((err) => next(err))
            }

            else {
                next(new Error(config.errors.noNameValue))
            }
        })
    }



    // SUPPRIMER UN MEMBRE
    static delete(id) {
        return new Promise((next) => {

            db.query('SELECT * FROM members WHERE id = ?', [id])
            
            .then((result) => {

                if (result[0] != undefined) {
                    return db.query('DELETE FROM members WHERE id = ?', [id])
                }

                else {
                    next(new Error(config.errors.wrongID))
                }
            })

            .then(() => next(true))

            .catch((err) => next(err))
        })
    }
}