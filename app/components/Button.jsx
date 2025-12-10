// components/Button.js
import Image from "next/image"

const Button = ({ type, title, icon, full }) => {
  return (
    <button
      className={`flexCenter text-secondary gap-3 rounded-full border-2 border-btns bg-btns px-8 py-5 transition ease-in duration-200 hover:-translate-y-1 hover:scale-110 ${full &&
        "w-full"}`}
      type={type}
    >
      {icon && <Image src={icon} alt={title} width={24} height={24} />}
      <label className="bold-16 whitespace-nowrap cursor-pointer">
        {title}
      </label>
    </button>
  )
}

export default Button