import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  pixelBasedPreset,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { Fragment } from 'react';

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
    <Tailwind config={{ presets: [pixelBasedPreset] }}>
      <Body className='py-10 font-sans'>
        <Container className='mx-auto rounded-lg border border-solid border-[#e5e7eb] bg-white'>
          {/* Padding on a cell: some mail clients, like Roundcube, ignore it on the table */}
          <Row>
            <Column className='p-8'>
              <Heading className='mt-0 mb-4 text-2xl font-bold'>
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
                  {/* Real line breaks, which survive when a reply turns this into text */}
                  {message.split('\n').map((line, i) => (
                    <Fragment key={i}>
                      {i > 0 && <br />}
                      {line}
                    </Fragment>
                  ))}
                </Text>
              </Section>
            </Column>
          </Row>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
