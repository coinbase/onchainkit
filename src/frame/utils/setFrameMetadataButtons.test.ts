import { describe, expect, it } from "vitest";
import { setFrameMetadataButtons } from "./setFrameMetadataButtons";

describe("setFrameMetadataButtons", () => {
    it("should return the correct metadata", () => {
        expect(
            setFrameMetadataButtons({}, [
                { label: "button1", action: "post" },
                { label: "button2", action: "post_redirect" },
                { label: "button3" },
            ])
        ).toEqual({
            "fc:frame:button:1": "button1",
            "fc:frame:button:1:action": "post",
            "fc:frame:button:2": "button2",
            "fc:frame:button:2:action": "post_redirect",
            "fc:frame:button:3": "button3",
        });
    });

    it("should return the correct metadata for button with action tx and target", () => {
        expect(
            setFrameMetadataButtons({}, [
                {
                    label: "Button1",
                    action: "tx",
                    target: "https://zizzamia.xyz/api/frame/tx",
                },
            ])
        ).toEqual({
            "fc:frame:button:1": "Button1",
            "fc:frame:button:1:action": "tx",
            "fc:frame:button:1:target": "https://zizzamia.xyz/api/frame/tx",
        });
    });

    it("should return the correct metadata for buttons with action tx and custom targets", () => {
        expect(
            setFrameMetadataButtons({}, [
                {
                    label: "Button1",
                    action: "tx",
                    target: "https://zizzamia.xyz/api/frame/tx?queryParam=XXX",
                },
                {
                    label: "Button1",
                    action: "tx",
                    target: "https://zizzamia.xyz/api/frame/tx?queryParam=YYY",
                },
            ])
        ).toEqual({
            "fc:frame:button:1": "Button1",
            "fc:frame:button:1:action": "tx",
            "fc:frame:button:1:target":
                "https://zizzamia.xyz/api/frame/tx?queryParam=xxx",
            "fc:frame:button:2": "Button2",
            "fc:frame:button:2:action": "tx",
            "fc:frame:button:2:target":
                "https://zizzamia.xyz/api/frame/tx?queryParam=YYY",
        });
    });

    it("should return the correct metadata for buttons with action post and custom post_urls", () => {
        expect(
            setFrameMetadataButtons({}, [
                {
                    label: "Button1",
                    action: "post",
                    postUrl:
                        "https://zizzamia.xyz/api/frame/post-url?queryParam=XXX",
                },
                {
                    label: "Button2",
                    action: "post",
                    postUrl:
                        "https://zizzamia.xyz/api/frame/post-url?queryParam=YYY",
                },
            ])
        ).toEqual({
            "fc:frame:button:1": "Button1",
            "fc:frame:button:1:action": "post",
            "fc:frame:button:1:post_url":
                "https://zizzamia.xyz/api/frame/post-url?queryParam=XXX",
            "fc:frame:button:2": "Button2",
            "fc:frame:button:2:action": "post",
            "fc:frame:button:2:post_url":
                "https://zizzamia.xyz/api/frame/post-url?queryParam=YYY",
        });
    });
});
