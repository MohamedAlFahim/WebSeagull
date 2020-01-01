import asyncio
import json
import websockets


class WebSeagullApplication:
    def __init__(self):
        self.connections = set()

    async def register_connection(self, websocket):
        self.connections.add(websocket)

    async def unregister_connection(self, websocket):
        self.connections.remove(websocket)

    async def order_browser(self, message: dict):
        if self.connections:
            await asyncio.wait([
                each_connection.send(json.dumps(message))
                for each_connection in self.connections
            ])

    async def order_browser_to_evaluate_javascript(self, js_code: str):
        await self.order_browser({
            'type': 'evaluate_javascript',
            'code': js_code
        })

    async def order_browser_to_add_event_listener(self,
                                                  *,
                                                  target_selector: str,
                                                  event_type: str,
                                                  python_function_name: str,
                                                  await_too: bool = False):
        await self.order_browser({
            'type': 'add_event_listener',
            'selector': target_selector,
            'event_type': event_type,
            'python_function_name': python_function_name,
            'await_too': await_too
        })

    async def order_browser_to_add_event_listener_to_all(
        self,
        *,
        target_selector: str,
        event_type: str,
        python_function_name: str,
        await_too: bool = False):
        await self.order_browser({
            'type': 'add_event_listener_to_all',
            'selector': target_selector,
            'event_type': event_type,
            'python_function_name': python_function_name,
            'await_too': await_too
        })

    async def order_browser_to_set_inner_html(self, *, target_selector: str,
                                              html_code: str):
        await self.order_browser({
            'type': 'set_inner_html',
            'selector': target_selector,
            'code': html_code
        })

    async def order_browser_to_add_class(self, *, target_selector: str,
                                         class_name: str):
        await self.order_browser({
            'type': 'add_class',
            'selector': target_selector,
            'class_name': class_name
        })

    async def order_browser_to_remove_class(self, *, target_selector: str,
                                            class_name: str):
        await self.order_browser({
            'type': 'remove_class',
            'selector': target_selector,
            'class_name': class_name
        })

    async def order_browser_to_get_class_list(self, target_selector: str):
        await self.order_browser({
            'type': 'get_class_list',
            'selector': target_selector
        })

    async def order_browser_to_get_inner_html(self, target_selector: str):
        await self.order_browser({
            'type': 'get_inner_html',
            'selector': target_selector
        })


def run_application(application):
    start_server = websockets.serve(application, 'localhost', 6789)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
