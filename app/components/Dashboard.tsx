"use client";

import { useEffect, useState } from "react";
type Props = { data: any };

export default function Dashboard({ data }: Props) {
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [filter, setFilter] = useState("all");


    // loading
    useEffect(() => {
        const timer = setTimeout(() => {setLoading(false)}, 700);
        return () => clearTimeout(timer);
    }, []);

    // Calculate the property's status from its steps
    function getPropertyStatus(property: any) {
        if (property.steps.length === 0) {
            return "not_started";
        }

        const allComplete = property.steps.every((step: any) => step.status === "complete");
        if (allComplete) {
            return "live";
        }

        const needsAttention =
            property.steps.some(
            (step: any) =>
                step.status === "action_required"
            );

        if (needsAttention) {
            return "needs_attention";
        }

        return "in_progress";
    }

    // Friendly labels for the UI
    function getStatusLabel(status: string) {
        const labels: Record<string, string> = {
            live: "Live",
            in_progress: "In progress",
            needs_attention:
            "Needs attention",
            not_started: "Not started",
        };

        return labels[status] || status;
    }

    // Filter properties
    const filteredProperties = data.properties.filter(
        (property: any) => {
            if (filter === "all") {
                return true;
            }
            return (
                getPropertyStatus(property) ===
                filter
            );
        }
    );

    // Live properties
    const liveProperties = data.properties.filter((property: any) => getPropertyStatus(property) === "live");

    // Properties needing attention
    const attentionProperties = data.properties.filter((property: any) => getPropertyStatus(property) === "needs_attention");

    // Loading state
    if (loading) {
        return (
            <main className="dashboard">
                <h1>Loading dashboard...</h1>
            </main>
        );
    }

    return (
        <main className="dashboard">

            {/* Header */}
            <header className="dashboard-header">
                <h1>Madestay Dashboard</h1>

                <div className="live-count">
                    Live properties:{" "}
                    {liveProperties.length}
                </div>
            </header>


            {/* Filters */}
            <div className="filter-container">

                <label htmlFor="status-filter">Filter properties:</label>

                <select
                    id="status-filter"
                    value={filter}
                    onChange={(event) =>
                    setFilter(event.target.value)
                    }
                >
                    <option value="all">
                    All properties
                    </option>

                    <option value="live">
                    Live
                    </option>

                    <option value="in_progress">
                    In progress
                    </option>

                    <option value="needs_attention">
                    Needs attention
                    </option>

                    <option value="not_started">
                    Not started
                    </option>
                </select>
            </div>


            {/* Main dashboard panels */}
            <section className="dashboard-grid">

                {/* Properties panel */}
                <div className="properties-panel">
                    <h2>Properties</h2>

                    {filteredProperties.length ===0 ? (
                        <div className="empty-state">
                            No properties found.
                        </div>

                    ) : (

                        filteredProperties.map(
                            (property: any) => {
                                const status =getPropertyStatus(property);
                                return (
                                    <button
                                        key={property.id}
                                        className="property-row"
                                        onClick={() =>
                                            setSelectedProperty(
                                            property
                                            )
                                        }
                                    >

                                        <div className="property-info">
                                            <strong>{property.name}</strong>
                                            <span>{property.location}</span>
                                        </div>

                                        <div className="property-status">

                                            <span className={`status status-${status}`}>
                                                {getStatusLabel(status)}
                                            </span>
                                        </div>

                                    </button>
                                );
                            }
                        )
                    )}
                </div>


                {/* Attention panel */}
                <div className="attention-panel">
                    <h2>Attention required</h2>

                    {attentionProperties.length === 0 ? (
                        <p>Nothing needs your attention.</p>
                    ) : (

                        attentionProperties.map(
                            (property: any) => {
                                const attentionSteps =
                                    property.steps.filter(
                                    (step: any) =>
                                        step.status ===
                                        "action_required"
                                    );

                                return (
                                    <div key={property.id} className="attention-property">
                                        <strong>{property.name}</strong>

                                        {attentionSteps.map((step: any) => {
                                            return (
                                                <p key={step.id}> 
                                                {step.note || "Action required"}
                                                </p>
                                            );    
                                        })}
                                    </div>
                                );
                            }
                        )
                    )}
                </div>
            </section>



            {/* Property detail modal */}
            {selectedProperty && (

                <div className="modal-overlay" onClick={() => setSelectedProperty(null)}>
                    <div className="property-modal" onClick={(event) => event.stopPropagation()}>
                        <button
                            className="close-button"
                            onClick={() =>
                            setSelectedProperty(null)
                            }
                        >
                            x
                        </button>


                        <h2>{selectedProperty.name}</h2>
                        <p>{selectedProperty.location}</p>
                        <p>{selectedProperty.bedrooms}{" "}bedrooms</p>
                        <h3>Onboarding progress</h3>

                        <h3>Checklist</h3>


                        {data.onboardingStepDefinitions
                            .map(
                                (definition: any) => {

                                    const step =
                                    selectedProperty.steps.find(
                                        (propertyStep: any) =>
                                        propertyStep.id ===
                                        definition.id
                                    );

                                    const stepStatus =
                                    step?.status ||
                                    "not_started";

                                    return (
                                        <div
                                            key={definition.id}
                                            className="checklist-item"
                                        >
                                            <div>
                                                <strong>{definition.label}</strong>
                                                <span>{getStatusLabel(stepStatus)}</span>
                                            </div>

                                            {step?.note && (
                                                <p>{step.note}</p>
                                            )}
                                        </div>
                                    );

                                }
                            )
                        }

                        <p>Target go-live date:{" "}{selectedProperty.targetGoLiveDate}</p>
                    </div>
                </div>
            )}

        </main>
    );
}