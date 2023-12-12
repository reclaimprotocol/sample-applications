import logo from './logo.svg';
import './App.css';
import { GenerateProof } from '@reclaimprotocol/reclaim-connect-react';

function App() {
  return (
    <div className="App">
       <GenerateProof
          appID='ba0023d9-235e-4bd9-b849-7fb45c075d18'
          onProofSubmission={(proofs, sessionId) => { 
            console.log(sessionId)
            console.log(proofs)
            console.log('Proof submitted')
           }}
          onProofSubmissionFailed={() => {
            console.log('Proof submission failed')
           }}
          customize = { 
            {
              triggerButton: { 
              text: 'Generate Proof', 
              style: { 

                } 
            },
            modalHeader: { 
              text: 'SCAN the QR to submit proof', 
              style: { 

                } 
            },
            proofSubmissionDetails: { 
              successText: 'Success', 
              failureText: 'Failed', 
              style: { 

                } 
            }} 
          } 
        />
    </div>
  );
}

export default App;
