var websocket = new WebSocket('ws://127.0.0.1:6789/');

websocket.onmessage = function (event) {
    data = JSON.parse(event.data);
    // Handle commands from the Python side
    switch (data.type) {
        case 'evaluate_javascript':
            eval(data.code);
            break;
        case 'add_event_listener':
            let target_element = document.querySelector(data.selector);
            // To have the event handler remember the value of data.python_function_name
            const message_dict_code = `{ 'type': 'event_was_triggered', 'name_of_python_function_to_call': '${data.python_function_name}' }`;
            target_element.addEventListener(data.event_type, new Function('event', `
                websocket.send(JSON.stringify( ${message_dict_code} ));
            `));
            break;
        case 'add_event_listener_to_all':
            let target_elements = document.querySelectorAll(data.selector);
            target_elements.forEach(element => {
                // If the element has an ID, the ID can also be sent. Otherwise, send an empty string for the id value.
                const id_value_code = (element.id === '') ? '""' : `"${element.id}"`;
                const message_dict_code = `{ 'type': 'event_was_triggered', 'name_of_python_function_to_call': '${data.python_function_name}', 'id': ${id_value_code} }`;
                element.addEventListener(data.event_type, new Function('event', `
                websocket.send(JSON.stringify( ${message_dict_code} ));
            `))
            });
            break;
        case 'set_inner_html':
            let target_element = document.querySelector(data.selector);
            target_element.innerHTML = data.code;
            break;
        case 'add_class':
            let target_element = document.querySelector(data.selector);
            target_element.classList.add(data.class_name);
            break;
        case 'remove_class':
            let target_element = document.querySelector(data.selector);
            target_element.classList.remove(data.class_name);
            break;
        case 'get_class_list':
            let target_element = document.querySelector(data.selector);
            const class_list = target_element.className.split(' ');
            websocket.send(JSON.stringify({ 'type': 'class_list', 'class_list': class_list }));
            break;
        case 'get_inner_html':
            let target_element = document.querySelector(data.selector);
            websocket.send(JSON.stringify({ 'type': 'inner_html', 'inner_html': target_element.innerHTML }));
            break;
        default:
            console.error('Unsupported event:', data);
    }
};