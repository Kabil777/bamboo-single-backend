import { visit } from 'unist-util-visit';

export default function remarkCallout() {
  return (tree: any) => {
    visit(tree, 'containerDirective', (node) => {
      const data = node.data || (node.data = {});
      
      data.hName = 'div';
      data.hProperties = {
        className: `callout callout-${node.name}`,
        'data-not-typeset': true
      };

      // Create a title node
      const titleNode = {
        type: 'paragraph',
        data: {
          hName: 'div',
          hProperties: { className: 'callout-title' }
        },
        children: [{ type: 'text', value: node.name }]
      };

      // Wrap the original children in a content div
      const contentNode = {
        type: 'div',
        data: {
          hName: 'div',
          hProperties: { className: 'callout-content' }
        },
        children: [...node.children]
      };

      node.children = [titleNode, contentNode];
    });
  };
}
