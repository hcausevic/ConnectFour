import React, {MouseEventHandler} from 'react';
import BootstrapModal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface ModalProps {
  header?: string,
  primaryLabel?: string;
  onPrimaryClick?: MouseEventHandler<HTMLElement>;
  secondaryLabel?: string;
  onSecondaryClick?: MouseEventHandler<HTMLElement>;
  secondary?: boolean;
  children?: React.ReactNode;
  centeredFooter?: boolean;
  primaryDisabled?: boolean;
  disableFooter?: boolean;
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
                 primaryDisabled,
                 disableFooter = false,
               }: ModalProps): JSX.Element => {

  return (
    <BootstrapModal show centered>
      {header && (
        <BootstrapModal.Header style={{justifyContent: 'center'}}>{header}</BootstrapModal.Header>
      )}
      <BootstrapModal.Body>{children}</BootstrapModal.Body>
      {!disableFooter && (
        <BootstrapModal.Footer style={{justifyContent: centeredFooter === true ? 'center' : 'flex-end'}}>
          {secondary &&
          <Button variant="info" style={{color: 'white'}} onClick={onSecondaryClick}>{secondaryLabel}</Button>
          }
          <Button variant="info" style={{color: 'white'}} onClick={onPrimaryClick}
                  disabled={primaryDisabled}>{primaryLabel}</Button>
        </BootstrapModal.Footer>
      )}
    </BootstrapModal>
  );
}

export default Modal;