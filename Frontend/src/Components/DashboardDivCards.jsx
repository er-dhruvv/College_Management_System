const DashboardDivCards = (props) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-indigo-600 mb-3">
                {props.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              {props.PTAG}
            </p>
            {props.btn}
          </div>
  )
}

export default DashboardDivCards