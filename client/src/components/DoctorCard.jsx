import React, { useState } from "react";
import { Avatar, Card, Button } from "antd";
import { DoctorCheckAvailabilityModal } from "./Modals";

const DoctorCard = ({ loading, data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalEmail, setModalEmail] = useState("");
    const showModal = (email) => {
        setModalEmail(email);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalEmail("");
    };
    return (
        <div
            className="cards"
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "10px",
            }}
        >
            {data.map((card, index) => (
                <Card
                    id="doctorcard"
                    key={card.email}
                    loading={loading}
                    actions={[
                        <Button
                            id="checkAvailability"
                            key="checkAvailability"
                            type="primary"
                            onClick={() => showModal(card.email)}
                        >
                            Check availability
                        </Button>,
                    ]}
                    style={{ minWidth: 300, margin: "auto" }}
                >
                    <Card.Meta
                        avatar={
                            <Avatar
                                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${
                                    index + 1
                                }`}
                            />
                        }
                        title={card.name}
                        description={
                            <>
                                <p key="gender">{card.gender}</p>
                            </>
                        }
                    />
                </Card>
            ))}
            {modalEmail && (
                <DoctorCheckAvailabilityModal
                    open={isModalOpen}
                    onClose={closeModal}
                    email={modalEmail}
                />
            )}
        </div>
    );
};

export default DoctorCard;