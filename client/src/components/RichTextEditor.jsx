// src/components/RichTextEditor/RichTextEditor.jsx
import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
};

const RichTextEditor = ({ value, onChange }) => (
  <ReactQuill 
    theme="snow" 
    value={value}
    onChange={onChange}
    modules={modules}
  />
);

export default RichTextEditor;
