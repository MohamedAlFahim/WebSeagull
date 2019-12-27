import asyncio
import json
import websockets

CONNECTIONS = set()


async def order_browser_to_evaluate_javascript(code: str):
    if CONNECTIONS:
        message = json.dumps({'type': 'evaluate_javascript', 'code': code})
        await asyncio.wait(
            [each_connection.send(message) for each_connection in CONNECTIONS])


async def order_browser_to_add_event_listener(*,
                                              selector: str,
                                              event_type: str,
                                              python_function_name: str,
                                              await_too: bool = False):
    if CONNECTIONS:
        message = json.dumps({
            'type': 'add_event_listener',
            'selector': selector,
            'event_type': event_type,
            'python_function_name': python_function_name,
            'await_too': await_too
        })
        await asyncio.wait(
            [each_connection.send(message) for each_connection in CONNECTIONS])


async def order_browser_to_add_event_listener_to_all(*,
                                                     selector: str,
                                                     event_type: str,
                                                     python_function_name: str,
                                                     await_too: bool = False):
    if CONNECTIONS:
        message = json.dumps({
            'type': 'add_event_listener_to_all',
            'selector': selector,
            'event_type': event_type,
            'python_function_name': python_function_name,
            'await_too': await_too
        })
        await asyncio.wait(
            [each_connection.send(message) for each_connection in CONNECTIONS])


async def order_browser_to_set_inner_html(*, selector: str, code: str):
    if CONNECTIONS:
        message = json.dumps({
            'type': 'set_inner_html',
            'selector': selector,
            'code': code
        })
        await asyncio.wait(
            [each_connection.send(message) for each_connection in CONNECTIONS])


async def order_browser_to_add_class(*, selector: str, class_name: str):
    if CONNECTIONS:
        message = json.dumps({
            'type': 'add_class',
            'selector': selector,
            'class_name': class_name
        })
        await asyncio.wait(
            [each_connection.send(message) for each_connection in CONNECTIONS])


async def order_browser_to_remove_class(*, selector: str, class_name: str):
    if CONNECTIONS:
        message = json.dumps({
            'type': 'remove_class',
            'selector': selector,
            'class_name': class_name
        })
        await asyncio.wait(
            [each_connection.send(message) for each_connection in CONNECTIONS])


async def order_browser_to_get_class_list(selector: str):
    if CONNECTIONS:
        message = json.dumps({'type': 'get_class_list', 'selector': selector})
        await asyncio.wait(
            [each_connection.send(message) for each_connection in CONNECTIONS])


async def order_browser_to_get_inner_html(selector: str):
    if CONNECTIONS:
        message = json.dumps({'type': 'get_inner_html', 'selector': selector})
        await asyncio.wait(
            [each_connection.send(message) for each_connection in CONNECTIONS])


async def register_connection(websocket):
    CONNECTIONS.add(websocket)


async def unregister_connection(websocket):
    CONNECTIONS.remove(websocket)


def run_application(application):
    start_server = websockets.serve(application, 'localhost', 6789)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
