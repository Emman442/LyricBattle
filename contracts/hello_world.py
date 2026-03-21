from genlayer import *
 
class MyContract(gl.Contract):
    data: TreeMap[Address, str]
 
    def __init__(self):
        self.data = TreeMap()
 
    @gl.public.view
    def get_data(self, addr: Address) -> str:
        return self.data.get(addr, "")
 
    @gl.public.write
    def set_data(self, value: str):
        self.data[gl.message.sender_address] = value