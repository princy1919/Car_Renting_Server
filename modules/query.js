export const controllers = {
  createOne(model, body) {
    return model.create(body)
  },

  updateOne(model, _id, update) {
    console.log("in updateOne ")
    return model.findByIdAndUpdate(_id, update)
  },

  deleteOne(model, docToDelete) {
    console.log("in deleteOne : ", docToDelete._id)
    // return docToDelete.remove()
    return model.findOneAndRemove({ _id: docToDelete._id })
  },

  getOne(docToGet) {
    return Promise.resolve(docToGet)
  },

  getAll(model, filter={}) {
    return model.find(filter)
  },

  findByParam(model, id) {
    console.log("The id is", id)
    return model.findById(id)
  },

  insertMany(model, body) {
    console.log("insert many")
    return model.insertMany(body)
  }
}

export const createOne = (model) => (req, res, next) => {
  console.log("in createOne")
  return controllers.createOne(model, req.body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

export const updateOne = (model) => async (req, res, next) => {
  console.log("in updateOne", req.body)
  const docToUpdate = req.docFromId
  const { _id } = docToUpdate
  const update = req.body
  return controllers.updateOne(model, _id, update)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

export const deleteOne = (model) => (req, res, next) => controllers.deleteOne(model, req.docFromId)
  .then(doc => {
    console.log("ok in deleteOne : ", doc._id)
    res.status(201).json(doc)
  })
  .catch(error => next(error))

export const getOne = () => (req, res, next) => {
  console.log(req.docFromId, req.docToUpdate)
  console.log("Entered the")
  return controllers.getOne(req.docFromId)
    .then(doc => res.status(200).json(doc))
    .catch(error => next(error))
}

// This function will help us get all the sub documents attached to a particular key
// Async returns a promise that needs to be either resolved or rejected
export const getAllSubDocuments = (model, subDocKey) =>  async ( req, res, next ) => {
  console.log("SUBDOCUMENT",subDocKey)
  console.log(req.params)

  const { id1:parentId } = req.params
  try {
    const subDocuments = await model
      .findById(parentId)
      .select(subDocKey)
      .exec()
    console.log("Found the sub documents")
    if(! subDocuments) {
      next({message:`There were no documents related to the Key : ${subDocKey}`})
    }
    res.json(subDocuments)
  }
  catch (err) {
    console.log(`Error - getAllSubDocuments : There is an error in finding ${subDocKey} on the parent`)
    next(err)
  }
}

export const insertUpdateAllSubDocuments = (model, subDocKey) =>  async ( req, res, next ) => {
  console.log("SUBDOCUMENT",subDocKey)
  console.log(req.params)

  const { id1:parentId } = req.params
  try {
    const subDocuments = await model.findByIdAndUpdate(parentId, {[subDocKey]:req.body}, {upsert:true, runValidators:true})
    if(! subDocuments) {
      next({message:`No Sub Documents were Updated for the key : ${subDocKey}`})
    }
    res.json(subDocuments)
  }
  catch (err) {
    console.log(`Error - insertUpdateAllSubDocuments : Tere was an error in insert all documents at key - ${subDocKey}`)
    next(err)
  }
}

export const getSingleSubDocument = (model, subDocKey) =>  async ( req, res, next ) => {
  console.log("SUBDOCUMENT",subDocKey)
  console.log(req.params)

  const { id1:parentId, id2:childId } = req.params
  try {
    const subDocuments = await model
      .findById(parentId)
      .select(subDocKey)
      .exec()

    if(! subDocuments) {
      next({message:`There were no documents related to the Key : ${subDocKey}`})
    }
    const subDocument = subDocuments[subDocKey].id(childId)

    if(! subDocument ) {
      next({message:`There was no subDocument associated with key - ${subDocKey} - with Id - ${childId} on the parent - ${parentId}`})
    }
    res.json(subDocument)
  }
  catch (err) {
    console.log(`Error - getSingleSubDocument: There is an error in finding ${subDocKey} on the parent`)
    next(err)
  }
}


export const deleteSingleDocument = (model, subDocKey) =>  async ( req, res, next ) => {
  console.log("SUBDOCUMENT",subDocKey)
  console.log(req.params)

  const { id1:parentId, id2:childId } = req.params
  try {
    const subDocuments = await model
      .findById(parentId)
      .select(subDocKey)
      .exec()

    if(! subDocuments) {
      next({message:`There were no documents related to the Key : ${subDocKey}`})
    }
    const subDocument = subDocuments[subDocKey].id(childId)
    if(! subDocument ) {
      next({message:`There was no subDocument associated with key - ${subDocKey} - with Id - ${childId} on the parent - ${parentId}`})
    }
    subDocuments[subDocKey].id(childId).remove()
  }
  catch (err) {
    console.log(`Error - getSingleSubDocument: There is an error in finding ${subDocKey} on the parent`)
    next(err)
  }
}

export const insertSingleSubDocument = (model, subDocKey) =>  async ( req, res, next ) => {
  const { id1:parentId } = req.params
  console.log(req.body)
  try {
    const updatedDocument = await model.findByIdAndUpdate(parentId,
      { "$push": { [subDocKey]: req.body } },
      {
        "new": true,
        "runValidators": true
      })

    res.json(updatedDocument)
  }
  catch(err) {
    console.log(`Error - insertSingleSubDocument: There is an error inserting document at key ${subDocKey} on the parent - ${parentId}`)
    next(err)
  }
}

export const putSingleSubDocument = (model, subDocKey) =>  async ( req, res, next ) => {
  console.log("entered put single document",req.params)
  console.log("The address sub document key is ", subDocKey)

  const { id1:parentId,id2:childId } = req.params
  try {
    const updatedDocument = await model.findOneAndUpdate(
      { "_id": parentId, [`${subDocKey}._id`]: childId },
      { "$set": { [`${subDocKey}.$`] : {...req.body,...{_id:childId}} } },
      {
        "new":true,
        "upsert": true,
        "runValidators": true
      })

    res.json(updatedDocument)
  }
  catch(err) {
    console.log(`Error - putSingleSubDocument: There is an error inserting document at key ${subDocKey} on the parent - ${parentId}`)
    next(err)
  }
}


export const getAll = (model) => async (req, res, next) => {
  console.log("qs : ", req.query)
  controllers.getAll(model, req.query)
    .then(docs => res.json(docs))
    .catch(error => next(error))
}

export const findByParam = (model) => (req, res, next, id) => controllers.findByParam(model,id)
  .then(doc => {
    console.log("THIS IS WHAT WAS RETURNED IN THE PROMISE")
    if (!doc) {
      next(new Error("Not Found Error"))
    } else {
      req.docFromId = doc
      next()
    }
  })
  .catch(error => {
    next(error)
  })


export const generateControllers = (model,overrides = {}) => {
  const defaults = {
    findByParam: findByParam(model),
    getAll: getAll(model),
    getOne: getOne(),
    deleteOne: deleteOne(model),
    updateOne: updateOne(model),
    createOne: createOne(model)
  }
  return {...defaults, ...overrides}
}

export const generateSubDocControllers = (model,subDocKey="",overrides = {}) => {
  const defaults = {
    insertUpdateAllSubDocuments:insertUpdateAllSubDocuments(model,subDocKey),
    getAllSubDocs:getAllSubDocuments(model, subDocKey),
    getSingleSubDocument: getSingleSubDocument(model, subDocKey),
    deleteSingleDocument:deleteSingleDocument(model, subDocKey),
    insertSingleSubDocument: insertSingleSubDocument(model, subDocKey),
    putSingleSubDocument:putSingleSubDocument(model, subDocKey)
  }
  return {...defaults, ...overrides}
}
