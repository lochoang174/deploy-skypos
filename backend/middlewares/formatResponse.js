const formatResponse = (req, res, next) => {
    console.log(req.responseData)
    const status = req.responseData.status || 200;
    const message = req.responseData.message || "Success";
    const data = req.responseData.data || null;

    // Gửi response với status, message và data
    return res.status(status).json({ status, message, data })
};

module.exports = formatResponse;
