class Logger {
    static warn() {
        const args = Array.prototype.slice.call(arguments);

        console.warn(...args );
    }

    static error() {
        const args = Array.prototype.slice.call(arguments);

        console.error(...args );
    }
}

export default Logger;
