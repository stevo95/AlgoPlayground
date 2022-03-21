
class BST {
    value: number;
    left: BST | null;
    right: BST | null;

    constructor(value: number) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
  
    insert(value: number) {
      if (value < this.value) {
        if (this.left === null) {
          this.left = new BST(value);
        } else {
          this.left.insert(value);
        }
      } else {
        if (this.right === null) {
          this.right = new BST(value);
        } else {
          this.right.insert(value);
        }
      }
    }
}

const constructBalancedBST = (array: number[]) => {
    return constructBalancedBSTRecursiveHelper(array, null, 0, array.length - 1);
}

/* 
    O(n) time complexity
    This is a recursive function to construct a balanced BST.
    It takes an array which has to be sorted and constructs a BST out of its values.
    It uses two pointers to navigate the array - startIdx and endIdx
*/

const constructBalancedBSTRecursiveHelper = (array: number[], tree: BST | null , startIdx: number, endIdx:number) => {

    // base case, if startIdx passes the value of endIdx, return
    if (startIdx > endIdx) {
        return;
    }

    // get newNodeValue, which will be the medium between startIdx value and endIdy value
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    const newNodeValue = array[middleIdx];
    /* 
        if tree is null, construct a tree root
        otherwise check if new value is smaller or larger / equal to current node value
        if its smaller, it will be the left child of current node
        if its larger or equal, it will be the right child of the current node
    */
    if (tree === null) {
        tree = new BST(newNodeValue);
    } else {
        if (newNodeValue < tree.value) {
            tree.left = new BST(newNodeValue);
            tree = tree.left;
        } else {
            tree.right = new BST(newNodeValue);
            tree = tree.right;
        }
    }

    // call the function recursively to construct the left side of BST and right side of BST respectively
    constructBalancedBSTRecursiveHelper(array, tree, startIdx, middleIdx - 1);
    constructBalancedBSTRecursiveHelper(array, tree, middleIdx + 1, endIdx);
    
    return tree;
}

export default constructBalancedBST;
