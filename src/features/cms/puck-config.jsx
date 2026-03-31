import React from 'react';
import ImageUploadField from './puck-fields/ImageUploadField';

const imageField = {
  type: 'custom',
  label: 'Image URL',
  render: (props) => <ImageUploadField {...props} />,
};

const puckConfig = {
  categories: {
    content: { title: 'Content', components: ['Heading', 'Paragraph', 'RichText', 'Checklist'] },
    layout: { title: 'Layout', components: ['Section', 'CardGrid', 'Spacer'] },
    media: { title: 'Media', components: ['ImageBlock', 'HeroBanner'] },
    contact: { title: 'Contact', components: ['ContactCard'] },
  },
  components: {
    Heading: {
      label: 'Heading',
      fields: {
        text: { type: 'text', label: 'Text' },
        level: {
          type: 'select',
          label: 'Level',
          options: [
            { label: 'H1', value: 'h1' },
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' },
            { label: 'H4', value: 'h4' },
          ],
        },
      },
      defaultProps: { text: 'Heading', level: 'h2' },
      render: ({ text, level }) => {
        const Tag = level || 'h2';
        const sizes = { h1: '2.25rem', h2: '1.5rem', h3: '1.25rem', h4: '1.125rem' };
        return (
          <Tag style={{ fontSize: sizes[Tag] || '1.5rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
            {text}
          </Tag>
        );
      },
    },

    Paragraph: {
      label: 'Paragraph',
      fields: {
        text: { type: 'textarea', label: 'Text' },
        size: {
          type: 'select',
          label: 'Size',
          options: [
            { label: 'Normal', value: 'base' },
            { label: 'Large', value: 'lg' },
            { label: 'Extra Large', value: 'xl' },
          ],
        },
      },
      defaultProps: { text: 'Your paragraph text here.', size: 'base' },
      render: ({ text, size }) => {
        const sizes = { base: '1rem', lg: '1.125rem', xl: '1.25rem' };
        return <p style={{ fontSize: sizes[size] || '1rem', color: '#4b5563', lineHeight: 1.75, marginBottom: '1.5rem' }}>{text}</p>;
      },
    },

    RichText: {
      label: 'Rich Text',
      fields: {
        html: { type: 'textarea', label: 'HTML Content' },
      },
      defaultProps: { html: '<p>Rich text content goes here.</p>' },
      render: ({ html }) => (
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ),
    },

    Checklist: {
      label: 'Checklist',
      fields: {
        title: { type: 'text', label: 'Title' },
        items: {
          type: 'textarea',
          label: 'Items (one per line)',
        },
      },
      defaultProps: {
        title: 'Why Choose Us?',
        items: 'Verified and inspected vehicles\nProfessional and experienced drivers\n24/7 customer support\nCompetitive pricing\nFlexible rental terms',
      },
      render: ({ title, items }) => {
        const list = (items || '').split('\n').filter(Boolean);
        return (
          <div style={{ marginBottom: '2rem' }}>
            {title && (
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
                {title}
              </h2>
            )}
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {list.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ color: '#10b981', fontSize: '1.25rem' }}>✓</span>
                  <span style={{ color: '#4b5563' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      },
    },

    Section: {
      label: 'Section',
      fields: {
        background: {
          type: 'select',
          label: 'Background',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Light Gray', value: 'gray' },
          ],
        },
        padding: {
          type: 'select',
          label: 'Padding',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
        rounded: { type: 'radio', label: 'Rounded', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
      },
      defaultProps: { background: 'gray', padding: 'md', rounded: 'yes' },
      render: ({ background, padding, rounded, puck: { renderDropZone } }) => {
        const bgColors = { white: '#ffffff', gray: '#f8fafc' };
        const paddings = { sm: '1rem', md: '2rem', lg: '3rem' };
        return (
          <div
            style={{
              background: bgColors[background] || '#f8fafc',
              padding: paddings[padding] || '2rem',
              borderRadius: rounded === 'yes' ? '2rem' : 0,
              marginBottom: '1.5rem',
            }}
          >
            {renderDropZone({ zone: 'section-content' })}
          </div>
        );
      },
    },

    CardGrid: {
      label: 'Card Grid',
      fields: {
        columns: {
          type: 'select',
          label: 'Columns',
          options: [
            { label: '2 Columns', value: '2' },
            { label: '3 Columns', value: '3' },
            { label: '4 Columns', value: '4' },
          ],
        },
        cards: {
          type: 'textarea',
          label: 'Cards (JSON array: [{title, text}])',
        },
      },
      defaultProps: {
        columns: '3',
        cards: JSON.stringify([
          { title: 'Car Rental', text: 'Daily, weekly, and monthly car hire options with free delivery in Ilorin.' },
          { title: 'Car Sales', text: 'Buy quality vehicles with verified inspection reports and transparent pricing.' },
          { title: 'Auto Services', text: 'Car washing, vehicle tracking, and comprehensive auto solutions.' },
        ]),
      },
      render: ({ columns, cards }) => {
        let parsed = [];
        try { parsed = JSON.parse(cards || '[]'); } catch { /* ignore */ }
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns || 3}, minmax(0, 1fr))`,
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            {parsed.map((card, i) => (
              <div key={i} style={{ border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '1rem' }}>
                <h3 style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>{card.title}</h3>
                <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>{card.text}</p>
              </div>
            ))}
          </div>
        );
      },
    },

    ContactCard: {
      label: 'Contact Card',
      fields: {
        address: { type: 'textarea', label: 'Address' },
        phone: { type: 'text', label: 'Phone' },
        email: { type: 'text', label: 'Email' },
      },
      defaultProps: {
        address: 'Oniyangi Complex, OFFA GARAGE RAILWAY LINE,\noff Asa-Dam Road, Ilorin 240101, Kwara',
        phone: '+2348144123316',
        email: 'info@ridevendor.com',
      },
      render: ({ address, phone, email }) => (
        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '2rem', marginBottom: '1.5rem' }}>
          {address && (
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              <strong>Address:</strong><br />
              {address.split('\n').map((line, i) => (
                <React.Fragment key={i}>{line}<br /></React.Fragment>
              ))}
            </p>
          )}
          {phone && <p style={{ color: '#4b5563', marginBottom: '1rem' }}><strong>Phone:</strong> {phone}</p>}
          {email && <p style={{ color: '#4b5563' }}><strong>Email:</strong> {email}</p>}
        </div>
      ),
    },

    HeroBanner: {
      label: 'Hero Banner',
      fields: {
        title: { type: 'text', label: 'Title' },
        subtitle: { type: 'textarea', label: 'Subtitle' },
        backgroundImage: imageField,
        overlayOpacity: {
          type: 'select',
          label: 'Overlay Opacity',
          options: [
            { label: 'Light', value: '0.3' },
            { label: 'Medium', value: '0.5' },
            { label: 'Dark', value: '0.7' },
          ],
        },
      },
      defaultProps: { title: 'Welcome', subtitle: 'Your subtitle here', backgroundImage: '', overlayOpacity: '0.5' },
      render: ({ title, subtitle, backgroundImage, overlayOpacity }) => (
        <div
          style={{
            position: 'relative',
            padding: '4rem 2rem',
            borderRadius: '2rem',
            overflow: 'hidden',
            marginBottom: '2rem',
            background: backgroundImage ? `url(${backgroundImage}) center/cover` : '#0f172a',
            color: '#ffffff',
            minHeight: 200,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `rgba(0,0,0,${overlayOpacity || 0.5})`,
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>{title}</h1>
            {subtitle && <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>{subtitle}</p>}
          </div>
        </div>
      ),
    },

    ImageBlock: {
      label: 'Image',
      fields: {
        src: imageField,
        alt: { type: 'text', label: 'Alt Text' },
        rounded: { type: 'radio', label: 'Rounded', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
      },
      defaultProps: { src: '', alt: 'Image', rounded: 'yes' },
      render: ({ src, alt, rounded }) =>
        src ? (
          <img
            src={src}
            alt={alt}
            style={{
              width: '100%',
              borderRadius: rounded === 'yes' ? '1rem' : 0,
              marginBottom: '1.5rem',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: 200,
              background: '#f1f5f9',
              borderRadius: rounded === 'yes' ? '1rem' : 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              marginBottom: '1.5rem',
            }}
          >
            No image selected
          </div>
        ),
    },

    Spacer: {
      label: 'Spacer',
      fields: {
        height: {
          type: 'select',
          label: 'Height',
          options: [
            { label: 'Small (16px)', value: '16' },
            { label: 'Medium (32px)', value: '32' },
            { label: 'Large (48px)', value: '48' },
            { label: 'XL (64px)', value: '64' },
          ],
        },
      },
      defaultProps: { height: '32' },
      render: ({ height }) => <div style={{ height: `${height || 32}px` }} />,
    },
  },
};

export default puckConfig;
