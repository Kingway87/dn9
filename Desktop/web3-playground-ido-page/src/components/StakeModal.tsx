import { ReactNode } from 'react'
import Modal from 'react-modal'

interface StakeModalProps {
  isOpen: boolean
  onRequestClose: () => void
  children: ReactNode
  modalStyles?: object // Optional prop for customizing modal styles
}

const defaultModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)', // Darker shadow for a dark theme
    backgroundColor: '#121111', // Dark background color
    color: '#fff', // White text color
    padding: '20px'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)' // Semi-transparent dark overlay
  }
}

Modal.setAppElement('#_app')

export default function StakeModal({
  isOpen,
  onRequestClose,
  children,
  modalStyles
}: StakeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Stake Modal"
      style={modalStyles || defaultModalStyles}
    >
      {children}
    </Modal>
  )
}
