export enum HTTPStatus {
    OK = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 400,
}

export class HTTPError extends Error {
    readonly statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }

    static BadRequest(message = 'Bad Request'): HTTPError {
        return new HTTPError(HTTPStatus.BadRequest, message);
    }

    static Unauthorized(message = 'Not authorized'): HTTPError {
        return new HTTPError(HTTPStatus.Unauthorized, message);
    }

    static Forbidden(message = 'No permission'): HTTPError {
        return new HTTPError(HTTPStatus.Forbidden, message);
    }

    static NotFound(message = 'Not found'): HTTPError {
        return new HTTPError(HTTPStatus.NotFound, message);
    }

    static InternalServerError(message = ''): HTTPError {
        return new HTTPError(HTTPStatus.InternalServerError, message);
    }
}
