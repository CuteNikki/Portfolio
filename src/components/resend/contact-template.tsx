import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface ContactTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactTemplate: React.FC<Readonly<ContactTemplateProps>> = ({
  name,
  email,
  subject,
  message,
}) => (
  <Html>
    <Head />
    <Preview>
      New message from {name} regarding {subject}
    </Preview>
    <Tailwind>
      <Body className='py-10 font-sans'>
        <Container className='mx-auto rounded-lg border p-8'>
          <Heading className='mb-4 text-2xl font-bold'>
            New Contact Form Submission
          </Heading>

          <Section className='mb-6'>
            <Text className='mb-1 text-sm font-semibold tracking-wide uppercase'>
              From
            </Text>
            <Text className='mt-0 text-lg'>
              {name} ({email})
            </Text>
          </Section>

          <Section className='mb-6'>
            <Text className='mb-1 text-sm font-semibold tracking-wide uppercase'>
              Subject
            </Text>
            <Text className='mt-0 text-lg'>{subject}</Text>
          </Section>

          <Hr className='my-6' />

          <Section>
            <Text className='mb-1 text-sm font-semibold tracking-wide uppercase'>
              Message
            </Text>
            <Text className='leading-relaxed whitespace-pre-wrap'>
              {message}
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
