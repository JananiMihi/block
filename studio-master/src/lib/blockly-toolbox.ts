
// // import type { ToolboxDefinition } from 'blockly/core/toolbox';
// // import 'blockly/blocks/logic';
// import 'blockly/blocks/loops';
// import 'blockly/blocks/math';
// import 'blockly/blocks/text';
// // import 'blockly/blocks/lists';
// // import 'blockly/blocks/colour';
// import 'blockly/blocks/variables';
// import 'blockly/blocks/variables_dynamic';
// import 'blockly/blocks/procedures';

export const defaultToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Logic',
      colour: '%{BKY_LOGIC_HUE}',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' }, 
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
        { kind: 'block', type: 'logic_null' },
        { kind: 'block', type: 'logic_ternary' },
      ],
    },
    {
      kind: 'category',
      name: 'Loops',
      colour: '%{BKY_LOOPS_HUE}',
      contents: [
        { kind: 'block', type: 'controls_repeat_ext', inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_for', inputs: { FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, TO: { shadow: { type: 'math_number', fields: { NUM: 10 } } }, BY: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
        { kind: 'block', type: 'controls_forEach' },
        { kind: 'block', type: 'controls_flow_statements' },
      ],
    },
    {
      kind: 'category',
      name: 'Math',
      colour: '%{BKY_MATH_HUE}',
      contents: [
        { kind: 'block', type: 'math_number', fields: { NUM: 123 } },
        { kind: 'block', type: 'math_arithmetic', inputs: { A: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
        { kind: 'block', type: 'math_single', inputs: { NUM: { shadow: { type: 'math_number', fields: { NUM: 9 } } } } },
        { kind: 'block', type: 'math_trig', inputs: { NUM: { shadow: { type: 'math_number', fields: { NUM: 45 } } } } },
        { kind: 'block', type: 'math_constant' },
        { kind: 'block', type: 'math_number_property', inputs: { NUMBER_TO_CHECK: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'math_round', inputs: { NUM: { shadow: { type: 'math_number', fields: { NUM: 3.1 } } } } },
        { kind: 'block', type: 'math_on_list' },
        { kind: 'block', type: 'math_modulo', inputs: { DIVIDEND: { shadow: { type: 'math_number', fields: { NUM: 64 } } }, DIVISOR: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'math_constrain', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 50 } } }, LOW: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, HIGH: { shadow: { type: 'math_number', fields: { NUM: 100 } } } } },
        { kind: 'block', type: 'math_random_int', inputs: { FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, TO: { shadow: { type: 'math_number', fields: { NUM: 100 } } } } },
        { kind: 'block', type: 'math_random_float' },
        { kind: 'block', type: 'math_atan2', inputs: { X: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, Y: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
      ],
    },
    {
      kind: 'category',
      name: 'Text',
      colour: '%{BKY_TEXTS_HUE}',
      contents: [
        { kind: 'block', type: 'text', fields: { TEXT: '' } },
        { kind: 'block', type: 'text_join' },
        { kind: 'block', type: 'text_append', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: '' } } } } },
        { kind: 'block', type: 'text_length', inputs: { VALUE: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } } },
        { kind: 'block', type: 'text_isEmpty', inputs: { VALUE: { shadow: { type: 'text', fields: { TEXT: '' } } } } },
        { kind: 'block', type: 'text_indexOf', inputs: { VALUE: { block: { type: 'variables_get', fields: { VAR: 'text' } } }, FIND: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } } },
        { kind: 'block', type: 'text_charAt', inputs: { VALUE: { block: { type: 'variables_get', fields: { VAR: 'text' } } } } },
        { kind: 'block', type: 'text_getSubstring', inputs: { STRING: { block: { type: 'variables_get', fields: { VAR: 'text' } } } } },
        { kind: 'block', type: 'text_changeCase', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } } },
        { kind: 'block', type: 'text_trim', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: ' abc ' } } } } },
        { kind: 'block', type: 'text_print', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } } },
        { kind: 'block', type: 'text_prompt_ext', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } } },
      ],
    },
    {
      kind: 'category',
      name: 'Lists',
      colour: '%{BKY_LISTS_HUE}',
      contents: [
        { kind: 'block', type: 'lists_create_with', extraState: { itemCount: 0 } },
        { kind: 'block', type: 'lists_create_with', extraState: { itemCount: 3 } },
        { kind: 'block', type: 'lists_repeat', inputs: { NUM: { shadow: { type: 'math_number', fields: { NUM: 5 } } } } },
        { kind: 'block', type: 'lists_length' },
        { kind: 'block', type: 'lists_isEmpty' },
        { kind: 'block', type: 'lists_indexOf', inputs: { VALUE: { block: { type: 'variables_get', fields: { VAR: 'list' } } } } },
        { kind: 'block', type: 'lists_getIndex', inputs: { VALUE: { block: { type: 'variables_get', fields: { VAR: 'list' } } } } },
        { kind: 'block', type: 'lists_setIndex', inputs: { LIST: { block: { type: 'variables_get', fields: { VAR: 'list' } } } } },
        { kind: 'block', type: 'lists_getSublist', inputs: { LIST: { block: { type: 'variables_get', fields: { VAR: 'list' } } } } },
        { kind: 'block', type: 'lists_split', inputs: { DELIM: { shadow: { type: 'text', fields: { TEXT: ',' } } } } },
        { kind: 'block', type: 'lists_sort' },
      ],
    },
    {
      kind: 'category',
      name: 'Colour',
      colour: '%{BKY_COLOUR_HUE}',
      contents: [
        { kind: 'block', type: 'colour_picker' },
        { kind: 'block', type: 'colour_random' },
        { kind: 'block', type: 'colour_rgb', inputs: { RED: { shadow: { type: 'math_number', fields: { NUM: 100 } } }, GREEN: { shadow: { type: 'math_number', fields: { NUM: 50 } } }, BLUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'colour_blend', inputs: { COLOUR1: { shadow: { type: 'colour_picker', fields: { COLOUR: '#ff0000' } } }, COLOUR2: { shadow: { type: 'colour_picker', fields: { COLOUR: '#3333ff' } } }, RATIO: { shadow: { type: 'math_number', fields: { NUM: 0.5 } } } } },
      ],
    },
    {
      kind: 'sep',
    },
    {
      kind: 'category',
      name: 'Variables',
      colour: '%{BKY_VARIABLES_HUE}',
      custom: 'VARIABLE',
    },
    {
      kind: 'category',
      name: 'Functions',
      colour: '%{BKY_PROCEDURES_HUE}',
      custom: 'PROCEDURE',
    },
  ],
};
