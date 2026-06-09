import { Board, Column, Card, Workspace } from '@/types';
import { generateUUID } from '@/utils';

const DAY = 86_400_000; // ms in a day — used to spread sample timestamps so velocity has a curve

export const sampleColumnToDo: Column = {
    id: generateUUID(),
    title: 'To Do',
    description: 'Tasks that need to be done',
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    cards: [
        {
            id: generateUUID(),
            title: 'Design social-media banner set',
            description: 'Facebook, Instagram, and X banners in the campaign palette',
            type: 'story',
            priority: 'high',
            points: 5,
            dueDate: Date.now() + 3 * DAY,
            createdAt: Date.now() - 2 * DAY,
            modifiedAt: Date.now() - 1 * DAY,
        },
        {
            id: generateUUID(),
            title: 'Set up A/B test for landing-page CTA',
            description: 'Test "Volunteer" vs "Join us" button copy',
            type: 'spike',
            priority: 'medium',
            points: 5,
            createdAt: Date.now() - 2 * DAY,
            modifiedAt: Date.now() - 2 * DAY,
        },
        {
            id: generateUUID(),
            title: 'Write volunteer phone-bank script',
            type: 'story',
            priority: 'low',
            points: 2,
            createdAt: Date.now() - 1 * DAY,
            modifiedAt: Date.now() - 1 * DAY,
        },
    ]
};
export const sampleColumnInProgress: Column = {
    id: generateUUID(),
    title: 'In Progress',
    description: 'Tasks that are currently in progress',
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    cards: [
        {
            id: generateUUID(),
            title: 'Build voter-turnout analytics dashboard',
            description: 'Recharts dashboard pulling early-vote counts by county',
            type: 'story',
            priority: 'high',
            points: 8,
            dueDate: Date.now() + 5 * DAY,
            createdAt: Date.now() - 4 * DAY,
            modifiedAt: Date.now(),
        },
        {
            id: generateUUID(),
            title: 'Produce rally press release',
            description: 'Draft for the Saturday downtown rally',
            type: 'story',
            priority: 'medium',
            points: 3,
            createdAt: Date.now() - 3 * DAY,
            modifiedAt: Date.now(),
        },
    ]
};
export const sampleColumnDone: Column = {
    id: generateUUID(),
    title: 'Done',
    description: 'Tasks that have been completed',
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    cards: [
        {
            id: generateUUID(),
            title: 'Launch Spanish-language ad variant',
            description: 'Localized video ad for key markets',
            type: 'story',
            priority: 'high',
            points: 5,
            createdAt: Date.now() - 4 * DAY,
            modifiedAt: Date.now() - 1 * DAY,
        },
        {
            id: generateUUID(),
            title: 'Send fundraising email blast',
            type: 'story',
            priority: 'high',
            points: 3,
            createdAt: Date.now() - 5 * DAY,
            modifiedAt: Date.now() - 2 * DAY,
        },
        {
            id: generateUUID(),
            title: 'Finalize campaign logo & brand kit',
            description: 'Vector logo, color tokens, typography',
            type: 'debt',
            priority: 'medium',
            points: 2,
            createdAt: Date.now() - 8 * DAY,
            modifiedAt: Date.now() - 4 * DAY,
        },
        {
            id: generateUUID(),
            title: 'Publish candidate bio page',
            type: 'story',
            priority: 'low',
            points: 2,
            createdAt: Date.now() - 9 * DAY,
            modifiedAt: Date.now() - 6 * DAY,
        },
    ]

};
export const sampleColumnBacklog: Column = {
    id: generateUUID(),
    title: 'Backlog',
    description: 'Tasks that are in the backlog',
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    cards: [
        {
            id: generateUUID(),
            title: 'Research swing-district voter demographics',
            description: 'Age, turnout history, and top issues by precinct',
            type: 'spike',
            priority: 'high',
            points: 8,
            createdAt: Date.now() - 1 * DAY,
            modifiedAt: Date.now() - 1 * DAY,
        },
        {
            id: generateUUID(),
            title: 'Draft weekly email newsletter template',
            type: 'story',
            priority: 'medium',
            points: 3,
            createdAt: Date.now() - 1 * DAY,
            modifiedAt: Date.now() - 1 * DAY,
        },
    ]
};


export const sampleBoard: Board = {
    id: generateUUID(),
    title: 'Project Alpha',
    description: 'This is the main board for Project Alpha',
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    columns: [sampleColumnToDo, sampleColumnInProgress, sampleColumnDone, sampleColumnBacklog]
};

export const sampleWorkspace: Workspace = {
    id: generateUUID(),
    title: 'My Workspace',
    description: 'This is my personal workspace',
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    boards: [sampleBoard]
};