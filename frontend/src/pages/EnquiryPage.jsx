import { useParams } from 'react-router-dom';

// Screen 06 - see docs/design/screens/06_Connect_Enquiry.png
// TODO: form posting to services/enquiryService.sendEnquiry
export default function EnquiryPage() {
  const { id } = useParams();

  return (
    <section>
      <h1>Contact provider</h1>
      <p>Enquiry form for listing {id} - to be built. Sending an enquiry does not reserve a stay.</p>
    </section>
  );
}
