function precedence(item: string): number {
    switch (item) {
        case "+":
        case "-":
            return 2;
        case "*":
        case "/":
            return 4;
        case "neg":
            return 3;
        case "(":
        case ")":
            return 1;
        default:
            return 10;
    }
}

class Node {
    public value: string;
    public precedence: number;
    public parent: Node | null = null;
    public left: Node | null = null;
    public right: Node | null = null;
    constructor(value: string) {
        this.value = value;
        this.precedence = precedence(value);
    }
}

class ExpressionTree {
    private root: Node = new Node("(");
    private currentNode: Node = this.root;

    public add(item: string): void {
        let newNode = new Node(item);
        //if ")" delete nearest "(" and climb to its parent
        if (item === ")") {
            while (this.currentNode.value !== "(" && this.currentNode.parent !== null) {
                this.currentNode = this.currentNode.parent;
            }
            // the exclamation marks used because "(" will always have a right child as long as input is valid
            if (this.currentNode.parent === null) {
                this.root = this.root.right!;
            } else {
                this.currentNode.parent.right = this.currentNode.right;
                this.currentNode.right!.parent = this.currentNode.parent;
                this.currentNode = this.currentNode.parent;
            }
        } else {
            if (item !== "(" && item !== "neg") {
                //climb to nearest node with smaller precedence
                while (this.currentNode.precedence >= newNode.precedence && this.currentNode.parent !== null) {
                    this.currentNode = this.currentNode.parent;
                }
            }
            //append new node as right child of current node setting its previous right child as new nodes left child
            newNode.left = this.currentNode.right;
            if (this.currentNode.right !== null) this.currentNode.right.parent = newNode;
            this.currentNode.right = newNode;
            newNode.parent = this.currentNode;
            this.currentNode = newNode;
        }
    }

    public *postOrderTraversal(node: Node | null = this.root): Generator<string, void, undefined> {
        if (node !== null) {
            yield* this.postOrderTraversal(node.left);
            yield* this.postOrderTraversal(node.right);
            yield node.value;
        }
    }

    public evaluate(): number {
        this.add(")");
        let stack: number[] = [];
        for (const item of this.postOrderTraversal()) {
            if (!isNaN(+item)) {
                stack.push(+item);
            } else if (item === "neg") {
                stack.push(-stack.pop()!);
            } else {
                let val1 = stack.pop()!;
                let val2 = stack.pop()!;
                switch (item) {
                    case "+":
                        stack.push(val2 + val1);
                        break;
                    case "-":
                        stack.push(val2 - val1);
                        break;
                    case "*":
                        stack.push(val2 * val1);
                        break;
                    case "/":
                        stack.push(val2 / val1);
                }
            }
        }
        return stack[0];
    }
}

export default function evaluateExpression(expression: string): number {
    //items - list of consecutive operators numbers and brackets
    let items = expression.match(/\d+(?:\.\d*)?|[()+\-*/]/g);
    if (items === null) throw new Error("invalid argument");
    let expressionTree = new ExpressionTree();
    let wasLastItemOperator = true;
    for (const item of items) {
        if (wasLastItemOperator && item === "-") {
            expressionTree.add("neg");
        } else {
            wasLastItemOperator = precedence(item) < 10 && item !== ")";
            expressionTree.add(item);
        }
    }
    return expressionTree.evaluate();
}