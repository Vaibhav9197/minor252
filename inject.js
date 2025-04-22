(function () {
    // Save original methods
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    // Hook into the 'open' method
    XMLHttpRequest.prototype.open = function (
        method,
        url,
        async,
        user,
        password
    ) {
        this._url = url; // Save URL for later use
        return originalOpen.apply(this, arguments); // Call the original 'open' method
    };

    // Hook into the 'send' method
    XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener("load", function () {
            // Filter requests based on the URL pattern
            const regex = /^https:\/\/api2\.maang\.in\/problems\/user\/\d+$/; // Match the desired URL pattern
            if (regex.test(this._url)) {
                const data = {
                    url: this._url, // Intercepted URL
                    status: this.status, // HTTP status code
                    response: this.responseText, // Response body
                };

                // Dispatch a custom event with the filtered data
                window.dispatchEvent(
                    new CustomEvent("xhrDataFetched", { detail: data })
                );
            }
        });

        return originalSend.apply(this, arguments); // Call the original 'send' method
    };
})();

const style = document.createElement("style");
style.innerHTML = `
.feedback-button {
    padding: 3px 7px;
    font-size: 20px;
    cursor: pointer;
    border: none;
    background-color: #e0e0e0;
    border-radius: 3px;
}
.feedback-button:hover {
    background-color:#6d6b6b;
}
.thumbs-up {
    color: green;
}
.thumbs-down {
    color: red;
}
`;
document.head.appendChild(style);

