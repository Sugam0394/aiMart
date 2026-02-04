// Base selector
export const selectExploreState = (state) => state.explore;

// Individual selectors
export const selectExploreSessionId = (state) =>
  selectExploreState(state).exploreSessionId;

export const selectCurrentStep = (state) =>
  selectExploreState(state).currentStep;

export const selectStepPayload = (state) =>
  selectExploreState(state).stepPayload;

export const selectExploreLoading = (state) =>
  selectExploreState(state).loading;

export const selectExploreError = (state) =>
  selectExploreState(state).error;
