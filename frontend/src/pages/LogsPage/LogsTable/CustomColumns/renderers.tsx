import { SearchExpression } from '@components/Search/Parser/listener'
import {
	Box,
	IconSolidPlayCircle,
	Stack,
	Table,
	Tag,
	Text,
} from '@highlight-run/ui/components'
import { LogLevel } from '@pages/LogsPage/LogsTable/LogLevel'
import { LogMessage } from '@pages/LogsPage/LogsTable/LogMessage'
import { useNavigate } from 'react-router-dom'

import { LogTimestamp } from '@/pages/LogsPage/LogsTable/LogTimestamp'

type ColumnRendererProps = {
	row: any
	getValue: () => any
	queryParts: SearchExpression[]
}

const EmptyState: React.FC = () => (
	<Text color="secondaryContentOnDisabled">empty</Text>
)

const StringColumnRenderer: React.FC<ColumnRendererProps> = ({ getValue }) => {
	const value = getValue()

	return (
		<Table.Cell alignItems="flex-start">
			{value ? (
				<Text lines="1" title={value}>
					{value}
				</Text>
			) : (
				<EmptyState />
			)}
		</Table.Cell>
	)
}

const SessionColumnRenderer: React.FC<ColumnRendererProps> = ({
	row,
	getValue,
}) => {
	const navigate = useNavigate()
	const secureSessionID = getValue()
	const log = row.original.node
	const onClick = secureSessionID
		? (e: any) => {
				e.stopPropagation()
				navigate(`/${log.projectID}/sessions/${secureSessionID}`)
		  }
		: undefined

	return (
		<Table.Cell alignItems="flex-start" onClick={onClick} py="4">
			<span>
				{secureSessionID ? (
					<Tag
						kind="secondary"
						shape="basic"
						iconLeft={<IconSolidPlayCircle />}
					>
						<Text lines="1">{secureSessionID}</Text>
					</Tag>
				) : (
					<EmptyState />
				)}
			</span>
		</Table.Cell>
	)
}

const DateTimeColumnRenderer: React.FC<ColumnRendererProps> = ({
	getValue,
}) => {
	const date = getValue()

	return (
		<Table.Cell alignItems="flex-start">
			{date ? (
				<Box pt="2">
					<LogTimestamp timestamp={date} />
				</Box>
			) : (
				<EmptyState />
			)}
		</Table.Cell>
	)
}

const LevelRenderer: React.FC<ColumnRendererProps> = ({ getValue }) => {
	const level = getValue()

	return (
		<Table.Cell alignItems="flex-start">
			{level ? (
				<Box pt="2">
					<LogLevel level={level} />
				</Box>
			) : (
				<EmptyState />
			)}
		</Table.Cell>
	)
}

const BodyRenderer: React.FC<ColumnRendererProps> = ({
	row,
	getValue,
	queryParts,
}) => {
	const message = getValue()

	return (
		<Table.Cell alignItems="flex-start">
			{message ? (
				<Stack gap="2" pt="2">
					<LogMessage
						queryParts={queryParts}
						message={message}
						expanded={row.getIsExpanded()}
					/>
				</Stack>
			) : (
				<EmptyState />
			)}
		</Table.Cell>
	)
}

export const ColumnRenderers = {
	body: BodyRenderer,
	datetime: DateTimeColumnRenderer,
	level: LevelRenderer,
	session: SessionColumnRenderer,
	string: StringColumnRenderer,
}
