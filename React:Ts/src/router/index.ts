import { lazy } from 'react';
import type { IRoute } from 'types/common';
import { ROLES } from 'types/roles';
import { instructorLabels as labels, instructorPaths as paths } from 'types/routes/instructor';

const DetailedEvent = lazy(() => import('pages/instructor/DetailedEvent'));
const Events = lazy(() => import('pages/instructor/Events'));

export const routes: IRoute[] = [
  {
    path: paths.detailedEvent,
    label: labels.detailedEvent,
    roles: [ROLES.MODERATOR, ROLES.ADMIN],
    element: <DetailedEvent />
  },
  {
    path: paths.events,
    label: labels.events,
    roles: [ROLES.MODERATOR, ROLES.ADMIN],
    element: <Events />
  }
