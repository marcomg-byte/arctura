'use client';
import classNames from 'classnames';
import type { FC } from 'react';
import {
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardMedia,
  Fab,
  Form,
  IconButton,
  Link,
  List,
  ListItem,
  ProgressStepper,
  Select,
  Step,
  TextArea,
  TextInput,
  Typography,
} from '@arctura/atomics';
import {
  faArrowRightLong,
  faBolt,
  faChartLine,
  faCheck,
  faCode,
  faCube,
  faPaperPlane,
  faPalette,
  faPlus,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type BackgroundColor = 'accent' | 'black' | 'primary' | 'secondary' | 'subtle' | 'white';

interface PreviewPanelProps {
  backgroundColor?: BackgroundColor;
}

const PreviewPanel: FC<PreviewPanelProps> = ({ backgroundColor = 'primary' }) => {
  const classes = classNames(
    'au:w-full au:grid au:grid-cols-1 au:gap-4 au:rounded-lg au:p-4 au:shadow-xl au:shadow-black/10 au:sm:grid-cols-2 au:xl:grid-cols-3',
    {
      'au:bg-accent': backgroundColor === 'accent',
      'au:bg-black': backgroundColor === 'black',
      'au:bg-primary': backgroundColor === 'primary',
      'au:bg-secondary': backgroundColor === 'secondary',
      'au:bg-subtle': backgroundColor === 'subtle',
      'au:bg-white': backgroundColor === 'white',
    }
  );
  const previewItemClasses =
    'au:flex au:min-h-40 au:flex-col au:items-start au:gap-3 au:rounded-lg au:bg-white au:p-4 au:shadow-md au:shadow-black/5 au:transition-all au:duration-300 au:ease-out au:hover:z-10 au:hover:scale-[1.02] au:hover:shadow-xl au:hover:shadow-black/15';

  return (
    <div className={classes}>
      <section className={previewItemClasses} aria-label="Typography preview">
        <Typography removePadding color="primary" variant="small">
          Typography
        </Typography>
        <div>
          <Typography removePadding color="primary" variant="h4">
            Product primitives
          </Typography>
          <Typography removePadding color="secondary" variant="small">
            Compact examples rendered from the atomics package.
          </Typography>
        </div>
      </section>
      <section className={previewItemClasses} aria-label="Link preview">
        <Typography removePadding color="primary" variant="small">
          Link
        </Typography>
        <Link href="#Components" color="accent" variant="base">
          Browse components
        </Link>
      </section>
      <section className={previewItemClasses} aria-label="Button preview">
        <Typography removePadding color="primary" variant="small">
          Button
        </Typography>
        <div className="au:flex au:flex-wrap au:items-center au:gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
          <Button size="sm" variant="text" endAdornment={faArrowRightLong}>
            Text
          </Button>
        </div>
      </section>
      <section className={previewItemClasses} aria-label="IconButton and Fab preview">
        <Typography removePadding color="primary" variant="small">
          IconButton / Fab
        </Typography>
        <div className="au:flex au:flex-wrap au:items-center au:gap-3">
          <IconButton aria-label="Code" size="md">
            <FontAwesomeIcon icon={faCode} />
          </IconButton>
          <IconButton aria-label="Palette" color="accent" size="md" variant="filled">
            <FontAwesomeIcon icon={faPalette} />
          </IconButton>
          <Fab
            aria-label="Add component"
            color="accent"
            size="lg"
            startAdornment={faPlus}
            variant="circular"
          />
        </div>
      </section>
      <section className={previewItemClasses} aria-label="Badge preview">
        <Typography removePadding color="primary" variant="small">
          Badge
        </Typography>
        <div className="au:flex au:flex-wrap au:items-start au:gap-2">
          <Badge color="primary" size="sm">
            Primary
          </Badge>
          <Badge color="success" size="sm" variant="outline" icon={faCheck}>
            Stable
          </Badge>
          <Badge color="warning" size="sm" variant="outline">
            Beta
          </Badge>
          <Badge color="danger" size="sm" variant="ghost">
            Deprecated
          </Badge>
        </div>
      </section>
      <section className={previewItemClasses} aria-label="TextInput preview">
        <Typography removePadding color="primary" variant="small">
          TextInput
        </Typography>
        <div className="au:flex au:w-full au:flex-col au:gap-3">
          <TextInput fullWidth aria-label="Name" placeholder="Enter your name" />
          <TextInput
            fullWidth
            aria-label="Email"
            defaultValue="name@arctura.dev"
            endAdornment={faCheck}
            status="success"
          />
        </div>
      </section>
      <section className={previewItemClasses} aria-label="TextArea preview">
        <Typography removePadding color="primary" variant="small">
          TextArea
        </Typography>
        <TextArea
          fullWidth
          aria-label="Message"
          defaultValue="Design system notes"
          endAdornments={[{ icon: faPaperPlane }]}
          rows={3}
        />
      </section>
      <section className={previewItemClasses} aria-label="Select preview">
        <Typography removePadding color="primary" variant="small">
          Select
        </Typography>
        <Select
          fullWidth
          defaultValue="react"
          label="Framework"
          options={[
            { value: 'react', label: 'React', icon: faCode },
            { value: 'theme', label: 'Theme', icon: faPalette },
          ]}
          classes={{
            root: 'au:text-primary',
            container: 'au:border-primary/30',
            optionsContainer: 'au:z-20 au:bg-white au:border-primary/30',
            placeholder: 'au:text-sm',
          }}
        />
      </section>
      <section className={previewItemClasses} aria-label="Form preview">
        <Typography removePadding color="primary" variant="small">
          Form
        </Typography>
        <Form
          aria-label="Preview form"
          noValidate
          startAdornment={faPaperPlane}
          title="Contact"
          classes={{
            form: 'au:w-full au:p-3 au:border-1 au:border-solid au:border-primary/10',
            header: 'au:hidden',
            footer: 'au:pt-1',
            submitButton: 'au:text-primary',
          }}
        >
          <TextInput fullWidth aria-label="Preview form email" placeholder="Email" />
        </Form>
      </section>
      <section className={previewItemClasses} aria-label="List preview">
        <Typography removePadding color="primary" variant="small">
          List
        </Typography>
        <List
          as="ul"
          fullWidth
          divider
          adornmentColor="accent"
          background="primary"
          color="white"
          itemsAs="li"
        >
          <ListItem title="Atomics" label="Reusable primitives" adornment={faCube} selected />
          <ListItem title="Theme" label="Token-driven styling" adornment={faPalette} />
        </List>
      </section>
      <section className={previewItemClasses} aria-label="Card preview">
        <Typography removePadding color="primary" variant="small">
          Card
        </Typography>
        <Card>
          <CardMedia src="/images/arctura-banner.png" alt="Arctura component preview" />
          <CardHeader
            adornment={faChartLine}
            badge={<Badge color="info">New</Badge>}
            title="Analytics"
            subtitle="Composable card slots."
          />
          <CardFooter
            actions={[{ label: 'View', endAdornment: faArrowRightLong, variant: 'text' }]}
          />
        </Card>
      </section>
      <section className={previewItemClasses} aria-label="ProgressStepper preview">
        <Typography removePadding color="primary" variant="small">
          ProgressStepper / Step / Connector
        </Typography>
        <ProgressStepper
          hideControls
          linear={false}
          orientation="vertical"
          classes={{
            root: 'au:overflow-visible au:px-0 au:py-0',
            step: {
              root: 'au:w-full au:max-w-full au:p-2',
              title: 'au:text-base au:sm:text-lg au:lg:text-xl',
            },
          }}
        >
          <Step title="Plan" label="Plan" icon={faStar} active description="Shape the API." />
          <Step title="Build" label="Build" icon={faBolt} description="Compose the UI." />
          <Step title="Ship" label="Ship" icon={faCheck} completed description="Verify output." />
        </ProgressStepper>
      </section>
    </div>
  );
};

PreviewPanel.displayName = 'PreviewPanel';

export { PreviewPanel };
