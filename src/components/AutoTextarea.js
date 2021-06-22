import React, { useState, useEffect, useRef, TextareaHTMLAttributes } from "react";

const AutoTextArea = (props) => {
  const textAreaRef = useRef(null);
  const [text, setText] = useState("");
  const [textAreaHeight, setTextAreaHeight] = useState("auto");
  const [parentHeight, setParentHeight] = useState("auto");

  useEffect(() => {
    setParentHeight(`${textAreaRef.current.scrollHeight}px`);
    setTextAreaHeight(`${textAreaRef.current.scrollHeight}px`);
  }, [text]);

  useEffect(() => {
    if (props.value !== text) {
      setTextAreaHeight("auto");
      setParentHeight(`${textAreaRef.current.scrollHeight}px`);
      setText(props.value);
    }
  }, [props.value]);

  const onChangeHandler = (event) => {
    setTextAreaHeight("auto");
    setParentHeight(`${textAreaRef.current.scrollHeight}px`);
    setText(event.target.value);

    if (props.onChange) {
      props.onChange(event);
    }
  };

  return (
    <div
      style={{
        minHeight: parentHeight,
      }}
    >
      <textarea
        {...props}
        ref={textAreaRef}
        rows={1}
        style={{
          height: textAreaHeight,
        }}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default AutoTextArea;
