function FeatureCard({ title, description, icon }) {

  return (

<div
  className="
  bg-white
  p-8
  rounded-2xl
  shadow-md
  hover:shadow-xl
  hover:-translate-y-1
  transition
  duration-300
  h-full
  min-h-[260px]
  flex
  flex-col
  "
>
      <div className="text-4xl mb-5">
        {icon}
      </div>

      <h2 className="text-2xl font-bold mb-3">
        {title}
      </h2>

      <p className="text-gray-500 leading-7">
        {description}
      </p>

    </div>

  )

}

export default FeatureCard