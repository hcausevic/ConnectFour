import React, {MouseEventHandler} from 'react';
import BootstrapModal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface ModalProps {
  header?: string,
  primaryLabel: string;
  onPrimaryClick: MouseEventHandler<HTMLElement>;
  secondaryLabel?: string;
  onSecondaryClick?: MouseEventHandler<HTMLElement>;
  secondary?: boolean;
  children?: React.ReactNode;
  centeredFooter?: boolean;
  primaryDisabled?: boolean;
}

const Modal = ({
                 header,
                 primaryLabel,
                 secondaryLabel,
                 onPrimaryClick,
                 onSecondaryClick,
                 secondary = false,
                 children,
                 centeredFooter = true,
                 primaryDisabled
               }: ModalProps): JSX.Element => {

  return (
    <BootstrapModal show centered>
      {header && (
        <BootstrapModal.Header style={{justifyContent: 'center'}}>{header}</BootstrapModal.Header>
      )}
      <BootstrapModal.Body>{children}</BootstrapModal.Body>
      <BootstrapModal.Footer style={{justifyContent: centeredFooter === true ? 'center' : 'flex-end'}}>
        {secondary &&
          <Button onClick={onSecondaryClick}>{secondaryLabel}</Button>
        }
        <Button onClick={onPrimaryClick} disabled={primaryDisabled}>{primaryLabel}</Button>
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
}

export default Modal;