package microsoft_teams

import (
	"os"
	"strings"

	"github.com/infracloudio/msbotbuilder-go/core"
	"github.com/infracloudio/msbotbuilder-go/core/activity"
	"github.com/infracloudio/msbotbuilder-go/schema"
	"github.com/pkg/errors"
)

type MicrosoftTeamsBot struct {
	core.Adapter
	TenantID string
	BotID    string
}

type BotAdapter struct {
	Adapter core.Adapter
	BotID   string
}

var BotMessagesHandler = activity.HandlerFuncs{
	OnMessageFunc: func(turn *activity.TurnContext) (schema.Activity, error) {
		if strings.EqualFold(turn.Activity.Text, "ping") {
			return turn.SendActivity(activity.MsgOptionText("POOONGGGG!!!!!!!!!!!!!"))
		}
		return schema.Activity{}, nil
	},
	// this is called whenever our bot or a new member is added/removed from the team.
	// use this to "uninstall/remove bot/teams integration integration"
	OnConversationUpdateFunc: func(turn *activity.TurnContext) (schema.Activity, error) {
		if len(turn.Activity.MembersRemoved) > 0 {
			for _, memberRemoved := range turn.Activity.MembersRemoved {
				if memberRemoved.ID == turn.Activity.Recipient.ID {
					// this is probably redundant since bot will no longer be part of the team but ...
					return turn.SendActivity(activity.MsgOptionText("Hightlight bot uninstalled successfully"))
				}
			}
		}

		if len(turn.Activity.MembersAdded) > 0 {
			// identify if our bot is part of the id
			for _, member := range turn.Activity.MembersAdded {
				// our bot is the recipient of this message - so we are being added to the conversation
				if member.ID == turn.Activity.Recipient.ID {
					return turn.SendActivity(activity.MsgOptionText("👋 your highlight notifications bot has been installed successfully. You can now set a teams channel as receipient for your alerts. Your highlight microsoft teams integration will be removed on highlight whenever you uninstall the bot."))
				}
			}
		}

		return schema.Activity{}, nil
	},
}

func (bot *MicrosoftTeamsBot) makeChannelConversation(channelId string) schema.ConversationAccount {
	return schema.ConversationAccount{
		IsGroup:          true,
		ConversationType: "channel",
		ID:               channelId,
		TenantID:         bot.TenantID,
	}
}

func (bot *MicrosoftTeamsBot) makeChannelMessageActivity(channelId string) schema.Activity {
	return schema.Activity{
		Type:         schema.Message,
		ChannelID:    "msteams",
		ServiceURL:   "https://smba.trafficmanager.net/amer/",
		Conversation: bot.makeChannelConversation(channelId),
		From: schema.ChannelAccount{
			ID: bot.BotID,
		},
	}
}

func NewMicrosoftTeamsBot(tenantID string) (*MicrosoftTeamsBot, error) {
	var (
		ok          bool
		botPassword string
		botID       string
	)
	if botPassword, ok = os.LookupEnv("MICROSOFT_TEAMS_BOT_PASSWORD"); !ok || botPassword == "" {
		return nil, errors.New("MICROSOFT_TEAMS_BOT_PASSWORD not set")
	}

	if botID, ok = os.LookupEnv("MICROSOFT_TEAMS_BOT_ID"); !ok || botID == "" {
		return nil, errors.New("MICROSOFT_TEAMS_BOT_ID not set")
	}

	setting := core.AdapterSetting{
		AppID:       botID,
		AppPassword: botPassword,
	}

	adapter, err := core.NewBotAdapter(setting)
	if err != nil {
		return nil, errors.Wrap(err, "Error creating adapter: error creating microsoft teams bot")
	}

	return &MicrosoftTeamsBot{adapter, tenantID, botID}, nil
}
