export const apiErrorHandler = (error, req, res,next) => {
  console.log(error)
  res.status(500).send({message:error.message || error.toString()})
}

export const logErrors = (err, req, res, next) => {
  console.error(err.stack)
  next(err)
}

export const clientErrorHandler = (err, req, res, next) => {
  if (req.xhr) {
    res.status(500).send({ error: "Something failed!" })
  } else {
    next(err)
  }
}
