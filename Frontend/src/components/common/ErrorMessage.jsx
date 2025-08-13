import { useTranslation } from "react-i18next"

const ErrorMessage = ({ translationKey = "common.error.default" }) => {
  const { t } = useTranslation()

  return (
    <div className="text-center text-red-600 py-10">
      <p>{t(translationKey)}</p>
    </div>
  )
}

export default ErrorMessage
