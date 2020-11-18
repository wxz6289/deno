export default ({ response }) => {
    response.status = 404;
    response.body = {
        error: "Not Found"
    }
}