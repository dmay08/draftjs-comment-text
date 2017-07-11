import React from 'react';
import { fromJS } from 'immutable';
import { EditorState, convertFromRaw, CompositeDecorator } from 'draft-js';

import {
  EXAMPLE_EDITOR_BLOCKS,
} from '../App/constants'; // eslint-disable-line

function strategyByType(type) {
  return function strate(contentBlock, callback, contentState) {
    return contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        if (entityKey !== null && contentState.getEntity(entityKey).getType() === type) {
          return true;
        }
        return false;
      },
      callback
    );
  };
}

const decorator = new CompositeDecorator([
  {
    strategy: strategyByType('COMMENT'),
    component: CommentSpan,
  },
]);

function CommentSpan(props) {
  return <span className="editor__comment" style={{ backgroundColor: 'yellow' }}>{props.children}</span>;
}

const initialState = fromJS({
  editorState: EditorState.createWithContent(convertFromRaw(EXAMPLE_EDITOR_BLOCKS), decorator),
});

export default function editorReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_EDITOR_STATE':
      return state
        .set('editorState', action.editorState);
    default:
      return state;
  }
}
