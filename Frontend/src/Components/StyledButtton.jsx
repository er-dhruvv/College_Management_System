

const StyledButtton = (props) => {
  return (
    <button onClick={props.onClick} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              {props.btnname}
    </button>
  )
}

export default StyledButtton