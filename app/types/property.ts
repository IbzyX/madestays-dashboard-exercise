export type StepStatus = 
    | "complete"
    | "in_progress"
    | "action_required"
    | "not_started"
    | "on_hold";

export type PropertyStatus = 
    | "live"
    | "in_progress"
    | "attention_required"
    | "not_started";



export type OnboardingStep = {
    id: string;
    status: StepStatus;
    note?: string;
};

export type StepDefinition = {
    id: string;
    label: string;
    order: number;
};

export type Property = {
    id: string;
    name: string;
    location: string;
    bedrooms: number;
    image: string;
    targetGoLiveData: string;
    steps: OnboardingStep[];
};

export type OnboardingData = {
  owner: {
    id: string;
    name: string;
    email: string;
    joinedDate: Date;//string
    accountManager: string;
  };

  onboardingStepDefinitions: StepDefinition[];

  statusLegend: Record<string, string>;

  properties: Property[];
};