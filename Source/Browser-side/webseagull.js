var websocket = new WebSocket('ws://127.0.0.1:6789/');

websocket.onmessage = function (event) {
    data = JSON.parse(event.data);
    // Handle commands from the Python side
    if (data.type === 'evaluate_javascript') {
        eval(data.code);
    } else if (data.type === 'add_event_listener') {
        let target_element = document.querySelector(data.selector);
        // To have the event handler remember the value of data.python_function_name
        const await_too_code = data.await_too ? 'true' : 'false';
        const message_dict_code = `{ 'type': 'event_was_triggered', 'name_of_python_function_to_call': '${data.python_function_name}', 'await_too': ${await_too_code} }`;
        // null check
        if (target_element) {
            target_element.addEventListener(data.event_type, new Function('event', `
                websocket.send(JSON.stringify( ${message_dict_code} ));
            `));
        }
    } else if (data.type === 'add_event_listener_to_all') {
        let target_elements = document.querySelectorAll(data.selector);
        target_elements.forEach(element => {
            const await_too_code = data.await_too ? 'true' : 'false';
            // If the element has an ID, the ID can also be sent. Otherwise, send an empty string for the id value.
            const id_value_code = (element.id === '') ? '""' : `"${element.id}"`;
            const message_dict_code = `{ 'type': 'event_was_triggered_with_id', 'name_of_python_function_to_call': '${data.python_function_name}', 'await_too': ${await_too_code}, 'id': ${id_value_code} }`;
            if (element) {
                element.addEventListener(data.event_type, new Function('event', `
                websocket.send(JSON.stringify( ${message_dict_code} ));
            `));
            }
        });
    } else if (data.type === 'set_inner_html') {
        let target_element = document.querySelector(data.selector);
        target_element.innerHTML = data.code;
    } else if (data.type === 'add_class') {
        let target_element = document.querySelector(data.selector);
        target_element.classList.add(data.class_name);
    } else if (data.type === 'remove_class') {
        let target_element = document.querySelector(data.selector);
        target_element.classList.remove(data.class_name);
    } else if (data.type === 'get_class_list') {
        let target_element = document.querySelector(data.selector);
        const class_list = target_element.className.split(' ');
        websocket.send(JSON.stringify({ 'type': 'class_list', 'class_list': class_list }));
    } else if (data.type === 'get_inner_html') {
        let target_element = document.querySelector(data.selector);
        websocket.send(JSON.stringify({ 'type': 'inner_html', 'inner_html': target_element.innerHTML }));
    } else {
        console.error('Unsupported event:', data);
    }
};