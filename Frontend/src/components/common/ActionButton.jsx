"use client"

import { useTranslation } from "react-i18next"

const ActionButton = ({
  variant = "primary",
  size = "sm",
  icon: Icon,
  children,
  translationKey,
  onClick,
  disabled = false,
  ...props
}) => {
  const { t } = useTranslation()

  const variants = {
    primary: "text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500",
    success: "text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500",
    danger: "text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500",
    secondary: "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500",
    indigo: "text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500",
  }

  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button
      className={`inline-flex items-center border border-transparent font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {translationKey ? t(translationKey) : children}
    </button>
  )
}

export default ActionButton
