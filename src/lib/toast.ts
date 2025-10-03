import { toast } from "sonner"

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      background: 'linear-gradient(135deg, #10B981, #059669)',
      color: 'white',
      border: 'none',
    },
  })
}

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
    style: {
      background: 'linear-gradient(135deg, #EF4444, #DC2626)',
      color: 'white',
      border: 'none',
    },
  })
}

export const showInfoToast = (message: string) => {
  toast.info(message, {
    duration: 3000,
    style: {
      background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      color: 'white',
      border: 'none',
    },
  })
}