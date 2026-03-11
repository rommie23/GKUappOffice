// src/utils/askForRating.js

import InAppReview from 'react-native-in-app-review';
import EncryptedStorage from 'react-native-encrypted-storage';

const REVIEWED_KEY = 'hasReviewedApp';

export const askForRating = async () => {
  try {
    const hasReviewed = await EncryptedStorage.getItem(REVIEWED_KEY);
    console.log(hasReviewed);
    

    if (hasReviewed === 'true') {
      console.log('✅ Already reviewed. Skipping prompt.');
      return;
    }

    if (InAppReview.isAvailable()) {
      console.log('🔔 Showing in-app review prompt...');
      const hasFlowFinishedSuccessfully = await InAppReview.RequestInAppReview();
      console.log('✅ Flow finished:', hasFlowFinishedSuccessfully);

      if (hasFlowFinishedSuccessfully) {
        await EncryptedStorage.setItem(REVIEWED_KEY, 'true');
        console.log('✅ Saved reviewed flag.');
      }
    } else {
      console.log('🚫 In-App Review not available.');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
};
