import { Modal } from "antd";

const OrderModal = ({ session, orderedBy, showModal, setShowModal }) => {
  return (
    <Modal
      visible={showModal}
      title="Order payment info"
      onCancel={() => setShowModal(!showModal)}
    >
      <p>Payment intent: {session.intent}</p>
      <p>Payment status: {session.status}</p>
      <p>
        Amount total: {session.purchase_units[0].amount.currency_code.toUpperCase()}{" "}
        {session.purchase_units[0].amount.value}
      </p>
      <p>Customer id: {session.payer.payer_id}</p>
      <p>Customer: {session.payer.name.given_name + " " +session.payer.name.surname}</p>
    </Modal>
  );
};

export default OrderModal;
