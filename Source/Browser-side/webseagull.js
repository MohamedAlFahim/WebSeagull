var websocket = new WebSocket("ws://127.0.0.1:6789/");

websocket.onmessage = function (event) {
    data = JSON.parse(event.data);
    // Handle commands from the Python side
    switch (data.type) {
        case 'evaluate_javascript':
            eval(data.code);
            break;
        case 'add_event_listener':
            var target_element = document.querySelector(data.selector);
            // To have the event handler remember the value of data.python_function_name
            var message_dict_code = `{ 'type': 'event_was_triggered', 'name_of_python_function_to_call': '${data.python_function_name}' }`;
            target_element.addEventListener(data.event_type, new Function('event', `
                websocket.send(JSON.stringify( ${message_dict_code} ));
            `));
            break;
        case 'add_event_listener_to_all':
            var target_elements = document.querySelectorAll(data.selector);
            target_elements.forEach(element => {
                // If the element has an ID, the outerHTML can also be sent. Otherwise, send an empty string for the outer_html value.
                var outer_html_value_code = (element.id === '') ? '""' : `document.getElementById('${element.id}').outerHTML`;
                var message_dict_code = `{ 'type': 'event_was_triggered', 'name_of_python_function_to_call': '${data.python_function_name}', 'outer_html': ${outer_html_value_code} }`;
                element.addEventListener(data.event_type, new Function('event', `
                websocket.send(JSON.stringify( ${message_dict_code} ));
            `))
            });
            break;
        default:
            console.error('Unsupported event:', data);
    }
};