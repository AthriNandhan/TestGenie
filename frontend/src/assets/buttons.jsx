function SimpleButton(props) {
  return (
    <div>
      <button
        className={`rounded-md bg-amber-400 ring-1 ring-gray-400 ${props.col}`}
      >
        Click me
      </button>
    </div>
  );
}

export default SimpleButton;
