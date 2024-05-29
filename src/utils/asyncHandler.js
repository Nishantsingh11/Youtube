// const asyncHandler = (fn) => async(req, res, next) => {
//   try {
//     console.log("i am in async handler");
//     return await fn(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
// promish wtih
const asyncHandler = (requsthandler) => {
  return (req, res, next) => {
    Promise.resolve(requsthandler(req, res, next)).catch((err) => next(err));
  };
};
export { asyncHandler };
