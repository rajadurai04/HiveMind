import hashlib
import random

l = []


def CreateAnIdea():
    pk = ""
    x = (random.randint(1000000000000000, 9999999999999999))
    if x not in l:
        l.append(str(x))
        pk = x
        # print(x)
    else:
        print("old key")

    class Node:
        def __init__(self, left, right, value: str, content, is_copied=False) -> None:
            self.left: Node = left
            self.right: Node = right
            self.value = value
            self.content = content
            self.is_copied = is_copied

        def hash(val: str) -> str:
            return hashlib.sha256(val.encode('utf-8')).hexdigest()

        def __str__(self):
            return (str(self.value))

        def copy(self):
            return Node(self.left, self.right, self.value, self.content, True)

    class Block:
        def __init__(self, prevhashVal, data, merkleRoot=0, hashVal=""):
            self.hashVal = hashVal
            self.merkleroot = merkleRoot
            self.prevHashVal = prevhashVal
            self.data = data

        def calculateHash(self):
            hashObj = hashlib.sha256(self.data.encode())
            return hashObj.hexdigest()

        def retHashVal(self):
            return self.hashVal

    class Blockchain:
        prevHash = "420"

        def __init__(self):
            self.chain = []
            hashVal = hashlib.sha256("genesis block".encode()).hexdigest()
            currBlock = Block(Blockchain.prevHash,
                              "genesis block", 6464, hashVal)
            Blockchain.prevHash = hashVal
            self.chain.append(currBlock)

        def addBlock(self, data):

            currBlock = Block(Blockchain.prevHash, data)
            hashVal = currBlock.calculateHash()
            currBlock.hashVal = hashVal
            self.chain.append(currBlock)

            Blockchain.prevHash = hashVal

        def generateMerkleRoot(self):
            pass

        def verifyChain(self) -> bool:
            chainLength = len(self.chain)
            for i in range(1, chainLength):
                currBlock = self.chain[i]
                prevBlock = self.chain[i]
                if currBlock.hashVal != currBlock.calculateHash():
                    return False
                if prevBlock.hashVal != currBlock.prevHashVal:
                    return False

            return True

        def indexBlock(self, pos) -> Block:
            if 2 > pos > len(self.chain):
                return None
            return self.chain[pos - 1]

        def displayChain(self):

            chain = self.chain
            for i in range(len(chain)):
                # if i==0:
                #     def create():
                #         today = datetime.datetime.now()
                #         db.collection('Minds').document('FarmEASY').set(
                #     {

                #     }
                #     )
                if i == 0:
                    print("Previous Hash Value:", chain[i].prevHashVal)
                    print("The private key is : ", pk)
                    print("Current Hash Value:", chain[i].hashVal)
                    print("Data:", chain[i].data)
                    print("\n")
                else:
                    print("Previous Hash Value:", chain[i].prevHashVal)
                    # print("Merkle Root:", chain[i].merkleroot)
                    print("Current Hash Value:", chain[i].hashVal)
                    print("Data:", chain[i].data)
                    print("\n")

        def generateListOfHashes(self):
            hashList = []
            for i in self.chain:
                hashList.append(i.retHashVal())
            return hashList

    myChain = Blockchain()
    b1 = input("Enter the idea")
    myChain.addBlock(b1)
    b2 = input("Add the Abstract")
    myChain.addBlock(b2)
    myChain.displayChain()


CreateAnIdea()
