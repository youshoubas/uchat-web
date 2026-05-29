import { MessageContent } from "wukongimjssdk"
import React from "react"
import WKApp from "../../App"
import MessageBase from "../Base"
import { MessageCell } from "../MessageCell"
import "./index.css"

export class FileContent extends MessageContent {
    name!: string
    size: number = 0
    url!: string
    mimeType?: string

    decodeJSON(content: any) {
        this.name = content["name"] || ""
        this.size = content["size"] || 0
        this.url = content["url"] || ""
        this.mimeType = content["mimeType"] || ""
    }

    encodeJSON() {
        return {
            "name": this.name || "",
            "size": this.size || 0,
            "url": this.url || "",
            "mimeType": this.mimeType || "",
        }
    }

    get conversationDigest() {
        return "[文件]"
    }
}

function formatFileSize(bytes: number): string {
    if (!bytes || bytes < 0) return "0 B"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

function getFileExtKey(name: string): string {
    const ext = (name.split('.').pop() || '').toLowerCase()
    if (ext === 'pdf') return 'pdf'
    if (['doc', 'docx'].indexOf(ext) >= 0) return 'doc'
    if (['xls', 'xlsx', 'csv'].indexOf(ext) >= 0) return 'xls'
    if (['ppt', 'pptx'].indexOf(ext) >= 0) return 'ppt'
    if (['zip', 'rar', '7z', 'tar', 'gz'].indexOf(ext) >= 0) return 'zip'
    if (['mp3', 'wav', 'flac', 'aac', 'ogg'].indexOf(ext) >= 0) return 'audio'
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].indexOf(ext) >= 0) return 'video'
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].indexOf(ext) >= 0) return 'image'
    if (['txt', 'md', 'json', 'log', 'xml', 'yaml', 'yml'].indexOf(ext) >= 0) return 'text'
    return 'default'
}

function getFileExtLabel(name: string): string {
    const ext = (name.split('.').pop() || '').toLowerCase()
    if (!ext || ext.length > 4) return 'FILE'
    return ext.toUpperCase()
}

export class FileCell extends MessageCell {
    render() {
        const { message, context } = this.props
        const content = message.content as FileContent
        const downloadURL = WKApp.dataSource.commonDataSource.getFileURL(content.url)
        const extKey = getFileExtKey(content.name)
        const extLabel = getFileExtLabel(content.name)
        return (
            <MessageBase context={context} message={message}>
                <a
                    href={downloadURL}
                    download={content.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wk-message-file"
                >
                    <div className={`wk-message-file-icon wk-message-file-icon-${extKey}`}>
                        {extLabel}
                    </div>
                    <div className="wk-message-file-info">
                        <div className="wk-message-file-name" title={content.name}>
                            {content.name}
                        </div>
                        <div className="wk-message-file-size">
                            {formatFileSize(content.size)}
                        </div>
                    </div>
                </a>
            </MessageBase>
        )
    }
}
